const { PNG } = require('pngjs')
const Pixel = require('./pixel')
const { MAX_DATABITS } = require('../../config/index')
const { split, combine, addEndingByte } = require('../parser/byteSplitter')
const fileReader = require('../reader/fileReader')
const fs = require('fs')

class Image {
  constructor(filePath) {
    const data = fs.readFileSync(filePath)
    this.png = PNG.sync.read(data)
  }

  hideData(filePath, keyPath) {
    const maxSizeInBytes = (this.png.width * this.png.height * Math.log2(MAX_DATABITS + 1)) / 8 - 1

    let file = fileReader.read(filePath, maxSizeInBytes)
    let key = fileReader.read(keyPath)

    file = split(file, MAX_DATABITS)
    file = addEndingByte(file, MAX_DATABITS)
    key = split(key, 0b1)

    const pixels = this.toSortedPixelArray(true)

    for (let i = 0; i < file.length; i++) {
      let pixel

      if (key[i % key.length] === 1) {
        pixel = pixels.pop()
      } else {
        pixel = pixels.shift()
      }

      pixel.hideData(file[i])
      this.replacePixelWith(pixel)
    }
  }

  extractData(keyPath, toFile) {
    let key = fileReader.read(keyPath)
    key = split(key, 0b1)

    const pixels = this.toSortedPixelArray()
    const p = pixels[0]

    const numberOfDataBits = Math.log2(MAX_DATABITS + 1)

    const extractedData = []
    let endingByteCount = 0
    let i = 0

    while (true) {
      let pixel

      if (key[i % key.length] === 1) {
        pixel = pixels.pop()
      } else {
        pixel = pixels.shift()
      }

      const data = pixel.extractData()

      extractedData.push(data)

      if (data === MAX_DATABITS) {
        endingByteCount++
      } else {
        endingByteCount = 0
      }

      if (endingByteCount * numberOfDataBits === 8) {
        break
      }

      i++
    }

    const bytes = combine(extractedData, MAX_DATABITS)

    const arr = new Uint8Array(bytes.length)
    bytes.forEach((b, i) => (arr[i] = b))

    fs.writeFileSync(toFile, Buffer.from(arr.buffer))
  }

  toSortedPixelArray(adjustHighAndLow) {
    const pixelArray = []

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
        if (adjustHighAndLow) pixel.adjustHighAndLow()
        this.replacePixelWith(pixel)

        pixelArray.push(pixel)
      }
    }

    pixelArray.sort((a, b) => {
      const difference = a.rgbSum() - b.rgbSum()
      if (difference !== 0) {
        return difference
      } else {
        return this.png.width * a.y + a.x - (this.png.width * b.y + b.x)
      }
    })

    return pixelArray
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
