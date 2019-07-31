const fs = require('fs')

/**
 * @param {string} path
 * @param {number} [maxSizeInBytes]
 */
const read = (path, maxSizeInBytes) => {
  const file = fs.readFileSync(path)

  if (maxSizeInBytes === undefined || maxSizeInBytes < 0 || file.length < maxSizeInBytes) {
    return file
  } else {
    throw Error('File is too large:', maxSizeInBytes, file.length)
  }
}

module.exports = { read }
