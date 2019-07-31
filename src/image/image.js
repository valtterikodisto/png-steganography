const { PNG } = require('pngjs')
const Pixel = require('./pixel')
const { MAX_DATABITS } = require('../../config/index')
const fileParser = require('../parser/fileParser')
const byteParser = require('../parser/byteParser')
const fs = require('fs')
const Deque = require('collections/deque')

class Image {
  constructor(filePath) {
    const data = fs.readFileSync(filePath)
    this.png = PNG.sync.read(data)
  }

  hideData(filePath, keyPath, outputName) {
    const fileMaxSize = (this.png.width * this.png.height * Math.log2(MAX_DATABITS + 1)) / 8 - 1

    const file = byteParser.split(fileParser.parse(filePath, fileMaxSize), MAX_DATABITS, true)
    const key = byteParser.split(fileParser.parse(keyPath), 0b1, false)

    const pixels = this.toSortedPixelDeque()
    pixels.forEach(pixel => {
      pixel.adjustHighAndLow()
      this.replacePixelWith(pixel)
    })

    for (let i = 0; i < file.length; i++) {
      const pixel = key[i % key.length] === 1 ? pixels.pop() : pixels.shift()
      pixel.hideData(file[i])
      this.replacePixelWith(pixel)
    }

    this.writeToFile(outputName)
  }

  extractData(keyPath, outputName) {
    const key = byteParser.split(fileParser.parse(keyPath), 0b1, false)
    const numberOfDataBits = Math.log2(MAX_DATABITS + 1)

    const pixels = this.toSortedPixelDeque()
    const data = new Deque() // This needs to be changed to a appropriate data structure

    let endingByteCounter = 0
    for (let i = 0; i < pixels.length; i++) {
      const pixel = key[i % key.length] === 1 ? pixels.pop() : pixels.shift()
      data.push(pixel.extractData())
      endingByteCounter = data[i] == MAX_DATABITS ? endingByteCounter + 1 : 0

      if (endingByteCounter >= 8 / numberOfDataBits) break
    }

    const extractedData = byteParser.combine(data, MAX_DATABITS, true)
    fs.writeFileSync(outputName, extractedData)
  }

  // Deque and merge sort will be used here
  toSortedPixelDeque() {
    const deque = []

    for (let y = 0; y < this.png.height; y++) {
      for (let x = 0; x < this.png.width; x++) {
        const idx = (this.png.width * y + x) << 2
        const pixel = new Pixel(
          this.png.data[idx],
          this.png.data[idx + 1],
          this.png.data[idx + 2],
          this.png.data[idx + 3],
          x,
          y
        )

        deque.push(pixel)
      }
    }

    deque.sort((a, b) => {
      const difference = a.rgbSum() - b.rgbSum()
      if (difference !== 0) {
        return difference
      } else {
        return this.png.width * a.y + a.x - (this.png.width * b.y + b.x)
      }
    })

    return new Deque(deque)
  }

  replacePixelWith(pixel) {
    const idx = (this.png.width * pixel.y + pixel.x) << 2
    this.png.data[idx] = pixel.red
    this.png.data[idx + 1] = pixel.green
    this.png.data[idx + 2] = pixel.blue
  }

  writeToFile(fileName) {
    const buffer = PNG.sync.write(this.png)
    fs.writeFileSync(fileName, buffer)
  }
}

module.exports = Image
