const ui = require('./ui/ui')
const Image = require('./image/image')

const app = {
  start: () => {
    const options = ui.readOptions()
    console.log(options)
    const image = new Image(options.image)
    console.log(image.png.width * image.png.height)
  }
}

module.exports = app
