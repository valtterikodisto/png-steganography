const ui = require('./ui/ui')
const Image = require('./image/image')

const app = {
  start: () => {
    const options = ui.readOptions()
    console.log(options)
    const image = new Image(options.image)

    if (options.extract) {
      image.extractData(options.key, options.output)
    } else {
      image.hideData(options.file, options.key, options.output)
    }
  }
}

module.exports = app
