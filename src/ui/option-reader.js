const rls = require('readline-sync')
const fs = require('fs')

const defaultOutput = 'out.png'

const options = {
  extract: false,
  image: null,
  file: null,
  key: null,
  output: null
}

const getPath = value => {
  if (value && value.length > 0 && (value.charAt(0) === '~' || value.charAt(0) === '/')) {
    return value
  }

  return `${process.cwd()}/${value}`
}

const checkPath = path => {
  try {
    if (fs.existsSync(getPath(path))) {
      return true
    }

    return false
  } catch (err) {
    console.error(err)
    return false
  }
}

const fromParams = () => {
  const exit = () => {
    console.error(`Invalid argument`)
    process.exit(1)
  }

  let i = 2

  while (i < process.argv.length) {
    const getValue = index => {
      if (index + 1 === process.argv.length) {
        exit()
      }

      const next = process.argv[i + 1]
      i++
      return next
    }

    switch (process.argv[i]) {
      case '-e':
      case '--extract':
        options.extract = true
        break
      case '-i':
      case '--image':
        options.image = getPath(getValue(i))
        break
      case '-f':
      case '--file':
        options.file = getPath(getValue(i))
        break
      case '-k':
      case '--key':
        options.key = getPath(getValue(i))
        break
      case '-o':
      case '--output':
        options.output = getPath(getValue(i))
        break
      default:
        exit()
    }

    i++
  }

  if (!options.image || !options.image) {
    exit()
  }

  if (options.extract && !options.output) {
    exit()
  }
  if (!options.extract && !options.output) {
    options.output = defaultOutput
  }

  return options
}

const fromUser = () => {
  const getExtractOption = () => {
    const extractOptions = ['Hide data', 'Extract data']
    const input = rls.keyInSelect(extractOptions, 'What do you want to do?')

    if (input < 0) {
      process.exit(0)
    } else if (input === 1) {
      options.extract = true
    }
  }

  const getImageOption = () => {
    const input = rls.question('Path to PNG image: ')

    if (input && checkPath(getPath(input))) {
      options.image = getPath(input)
    } else {
      console.log('Invalid path')
      getImageOption()
    }
  }

  const getKeyOption = () => {
    const input = rls.question('Path to key file: ')

    if (input && checkPath(getPath(input))) {
      options.key = getPath(input)
    } else {
      console.log('Invalid path')
      getKeyOption()
    }
  }

  const getOutputOption = (optional = true) => {
    const input = rls.question(`Name of the generated file${optional ? ' (optional)' : ''}: `)

    if (input || optional) {
      options.output = input ? input : defaultOutput
    } else {
      console.log('Invalid filename')
      getOutputOption(optional)
    }
  }

  getExtractOption()
  getImageOption()
  getKeyOption()
  getOutputOption(!options.extract)

  return options
}

module.exports = { fromParams, fromUser }
