const { MAX_DATABITS } = require('../../config/index')

class Pixel {
  /**
   * @constructor
   * @param {number} red Red [0-255]
   * @param {number} green Green [0-255]
   * @param {number} blue Blue [0-255]
   * @param {number} opacity Opacity [0-255]
   * @param {number} x X-axis coordinate
   * @param {number} y Y-axis coordinate
   */
  constructor(red, green, blue, opacity, x, y) {
    this.red = red
    this.green = green
    this.blue = blue
    this.opacity = opacity
    this.x = x
    this.y = y
  }

  /**
   * Adjust RGB red and green so that their sum is:
   * MAX_DATABITS <= (red + green) <= 255 - MAX_DATABITS
   * @see MAX_DATABITS
   */
  adjustHighAndLow() {
    if (this.red + this.green > 510 - MAX_DATABITS) {
      this.red = 255 - (MAX_DATABITS >>> 1)
      this.green = 255 - (MAX_DATABITS - (MAX_DATABITS >>> 1))
    } else if (this.red + this.green < MAX_DATABITS) {
      this.red = MAX_DATABITS >>> 1
      this.green = MAX_DATABITS - (MAX_DATABITS >>> 1)
    }
  }

  /**
   * Hides given data in the blue color and then balances
   * the RGB sum. Maximum value is based on MAX_DATABITS.
   * @param {number} data Data that will be hidden in the pixel
   * @see MAX_DATABITS
   */
  hideData(data) {
    const changeInBlueValue = data - (this.blue & MAX_DATABITS)
    this.blue = (this.blue & (255 - MAX_DATABITS)) | data
    this.balanceDataAddition(changeInBlueValue)
  }

  /**
   * Extracts and return data from blue color
   * @returns {number} Extracted data
   * @example
   * extractData() // Returns 0 if blue is 0b11110000
   */
  extractData() {
    return this.blue & MAX_DATABITS
  }

  /**
   * Balances the change so that RGB sum will remain the same
   * @param {number} change How much blue shifted due to data hiding
   * @example
   * // Added data shifted blue by -2 => Add 2 to red or green
   * balanceDataAddition(-2)
   */
  balanceDataAddition(change) {
    this.red -= change >> 1
    this.green -= change - (change >> 1)

    if (change < 0) {
      if (this.red > 255) {
        this.green += this.red - 255
        this.red = 255
      } else if (this.green > 255) {
        this.red += this.green - 255
        this.green = 255
      }
    } else if (change > 0) {
      if (this.red < 0) {
        this.green += this.red
        this.red = 0
      } else if (this.green < 0) {
        this.red += this.green
        this.green = 0
      }
    }
  }

  /**
   * Returns the sum of red, green and blue
   * @returns {number} Sum of red, green and blue
   */
  rgbSum() {
    return this.red + this.green + this.blue
  }
}

module.exports = Pixel
exports.MAX_DATABITS = MAX_DATABITS
