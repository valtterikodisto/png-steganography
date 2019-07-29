const optionReader = require('./option-reader')

const readOptions = () => {
  if (process.argv.length > 2) {
    return optionReader.fromParams()
  }
  return optionReader.fromUser()
}

const ui = {
  readOptions
}

module.exports = ui
