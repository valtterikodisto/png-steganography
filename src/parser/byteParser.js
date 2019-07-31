const split = (bytes, maxDataBits, endingByte) => {
  const numberOfDataBits = getNumberOfDataBits(maxDataBits)

  let bufferLength = (8 / numberOfDataBits) * bytes.length
  bufferLength += endingByte ? 8 / getNumberOfDataBits(maxDataBits) : 0
  const buffer = Buffer.allocUnsafe(bufferLength)

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

const combine = (bits, maxDataBits, endingByte) => {
  const numberOfDataBits = getNumberOfDataBits(maxDataBits)

  let bufferLength = bits.length / (8 / numberOfDataBits)
  bufferLength -= endingByte ? 1 : 0
  const buffer = Buffer.allocUnsafe(bufferLength)

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

const addEndingByte = (bytes, maxDataBits) => {
  const reservedSlotsForEndingByte = 8 / getNumberOfDataBits(maxDataBits)
  let index = bytes.length - reservedSlotsForEndingByte

  while (index < bytes.length) {
    bytes[index] = maxDataBits
    index++
  }
}

const getNumberOfDataBits = maxDataBits => Math.log2(maxDataBits + 1)

module.exports = { split, combine }
