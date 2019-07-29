const { PNG } = require('pngjs')
const Pixel = require('./pixel')
const fs = require('fs')

class Image {
  /**
   * @constructor
   * @param {string} filePath Path to image
   */
  constructor(filePath) {
    const data = fs.readFileSync(filePath)
    this.png = PNG.sync.read(data)
  }

  /**
   * Hides a file inside the image
   * @param {string} filePath Path to file
   * @param {string} keyPath Path to keyfile
   */
  hideData(filePath, keyPath) {
    const pixelArray = this.toPixelArray()

    pixelArray.forEach(pixel => {
      const idx = (this.png.width * pixel.y + pixel.x) << 2
      this.png.data[idx] = pixel.red
      this.png.data[idx + 1] = pixel.green
      this.png.data[idx + 2] = pixel.blue
    })
  }

  // Implement own data structure and sorting here
  /**
   * Converts PNG image to sorted array that contains
   * Pixels and balances too bright or dark pixels
   * @returns {Pixel[]} Array of Pixels
   */
  toPixelArray() {
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
        pixel.adjustHighAndLow()
        pixelArray.push(pixel)
      }
    }

    pixelArray.sort((a, b) => {
      const difference = a.rgbSum() - b.rgbSum()
      if (difference !== 0) {
        return difference
      } else {
        return (a.y - b.y) * this.png.width + a.x - b.x
      }
    })

    return pixelArray
  }

  /**
   * Writes current PNG image into a file
   * @param {string} fileName Name of the output file
   */
  writeToFile(fileName) {
    const buffer = PNG.sync.write(this.png)
    fs.writeFileSync(fileName, buffer)
  }
}

module.exports = Image
