const fileParser = require('../src/parser/fileParser')

describe('File is read correctly', () => {
  test('File contains the correct data', () => {
    const filePath = `${__dirname}/resources/file.txt`
    const byteArray = fileParser.parse(filePath)

    expect(byteArray[0]).toBe(115)
  })

  test('File length is correct', () => {
    const filePath = `${__dirname}/resources/file.txt`
    const byteArray = fileParser.parse(filePath)

    expect(byteArray.length).toBe(10)
  })

  test('Too large file will throw error', () => {
    const filePath = `${__dirname}/resources/file.txt`

    let error = false
    try {
      fileParser.parse(filePath, 0)
    } catch (err) {
      error = true
    }

    expect(error)
  })
})
