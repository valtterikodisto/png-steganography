const split = (file, maxDataBits) => {
  const numberOfBits = getNumberOfBits(maxDataBits)
  const splitFile = []

  file.forEach(byte => {
    let mask = maxDataBits << (8 - numberOfBits)
    let dataShift = 8 - numberOfBits

    while (mask >= maxDataBits) {
      let data = byte & mask
      data = data >>> dataShift
      splitFile.push(data)

      mask = mask >>> numberOfBits
      dataShift -= numberOfBits
    }
  })

  return splitFile
}

const combine = (array, maxDataBits) => {
  const list = []
  const numberOfBits = getNumberOfBits(maxDataBits)

  let extractedByte = 0
  let counter = getNumberOfBits(maxDataBits)

  for (let i = 0; i < array.length; i++) {
    const shiftBy = 8 - (counter % 8)
    const data = shiftBy === 8 ? array[i] : array[i] << shiftBy
    extractedByte = extractedByte | data

    if (extractedByte === 0b11111111) {
      break
    }

    if (shiftBy === 8) {
      list.push(extractedByte)
      extractedByte = 0
    }

    counter += numberOfBits
  }

  return list
}

const addEndingByte = (file, maxDataBits) => {
  const endingByte = []
  const numberOfBits = getNumberOfBits(maxDataBits)

  let split = 0b11111111 >>> (8 - numberOfBits)

  for (let i = 0; i < 8 / numberOfBits; i++) {
    endingByte.push(split)
  }

  file.push(...endingByte)

  return file
}

const getNumberOfBits = maxDataBits => Math.log2(maxDataBits + 1)

module.exports = {
  split,
  combine,
  addEndingByte
}
