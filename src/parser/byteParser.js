/**
 * Splits bytes in to bits
 * @param {Array} bytes Array of bytes
 * @param {Number} maxDataBits Maximum value that can be stored in pixel
 * @param {Boolean} endingByte Include ending byte 0xFF
 * @return {Buffer}
 * @example
 * const bytes = Buffer.from('a') // <Buffer 0b01100001>
 * split(btyes, 0b11, false) // Returns <Buffer 0b01 0b10 0b00 0b01>
 */
const split = (bytes, maxDataBits, endingByte) => {
  const numberOfDataBits = getNumberOfDataBits(maxDataBits)

  let bufferLength = (8 / numberOfDataBits) * bytes.length
  bufferLength += endingByte ? 8 / getNumberOfDataBits(maxDataBits) : 0
  const buffer = Buffer.alloc(bufferLength)

  let bufferIndex = 0
  bytes.forEach(byte => {
    let mask = maxDataBits << (8 - numberOfDataBits)
    let shiftSplittedBitsBy = 8 - numberOfDataBits

    while (mask >= maxDataBits) {
      const data = (byte & mask) >>> shiftSplittedBitsBy
      buffer[bufferIndex] = data

      mask = mask >>> numberOfDataBits
      shiftSplittedBitsBy -= numberOfDataBits
      bufferIndex++
    }
  })

  if (endingByte) addEndingByte(buffer, maxDataBits)

  return buffer
}

/**
 * Combines extracted bits to bytes
 * @param {Array} bits Array of extracted bits
 * @param {Number} maxDataBits Maximum value that can be stored in pixel
 * @param {Boolean} endingByte Data contains ending byte 0xFF
 * @return {Buffer}
 * @example
 * const bits = Buffer.from([0b01, 0b10, 0b00, 0b10, 0b11, 0b11, 0b11, 0b11,])
 * combine(bits, 0b11, true) // Returns <Buffer 0b01100010> (character 'b')
 */
const combine = (bits, maxDataBits, endingByte) => {
  const numberOfDataBits = getNumberOfDataBits(maxDataBits)

  let bufferLength = bits.length / (8 / numberOfDataBits)
  bufferLength -= endingByte ? 1 : 0
  const buffer = Buffer.alloc(bufferLength)

  const offset = 8 / numberOfDataBits
  let bufferIndex = 0

  for (let i = 0; i < bits.length; i = i + offset) {
    let extractedData = 0
    let index = 0

    while (index < offset) {
      const shiftSplittedBitsBy = 8 - (index + 1) * numberOfDataBits
      const data = bits[i + index] << shiftSplittedBitsBy

      extractedData = extractedData | data
      index++
    }

    if (extractedData === 255) break

    buffer[bufferIndex] = extractedData
    bufferIndex++
  }

  return buffer
}

/**
 * Adds ending byte to the end of array (0xFF)
 * @param {Array} bytes
 * @param {Number} maxDataBits
 */
const addEndingByte = (bytes, maxDataBits) => {
  const reservedSlotsForEndingByte = 8 / getNumberOfDataBits(maxDataBits)
  let index = bytes.length - reservedSlotsForEndingByte

  while (index < bytes.length) {
    bytes[index] = maxDataBits
    index++
  }
}

/**
 * Get how many bits are in the maximum value of data
 * @param {Number} maxDataBits
 * @example
 * getNumberOfDataBits(0b1111) // Returns 4
 */
const getNumberOfDataBits = maxDataBits => Math.log2(maxDataBits + 1)

module.exports = { split, combine }
