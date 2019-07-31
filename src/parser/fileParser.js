const fs = require('fs')

const parse = (filePath, maxSizeInBytes) => {
  const file = fs.readFileSync(filePath)

  if (maxSizeInBytes === undefined || maxSizeInBytes < 0 || file.length < maxSizeInBytes) {
    return file
  } else {
    throw Error('File is too large')
  }
}

module.exports = { parse }
