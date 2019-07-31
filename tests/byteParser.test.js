const byteParser = require('../src/parser/byteParser')
const { MAX_DATABITS } = require('../config/index')

describe('Bytes are split to bits correctly', () => {
  test('Data is correct', () => {
    const buf = Buffer.from('a')
    const parsed = byteParser.split(buf, MAX_DATABITS)

    expect(parsed).toEqual(Buffer.from([0b01, 0b10, 0b00, 0b01]))
  })

  test('Data is correct when ending byte is added', () => {
    const buf = Buffer.from('a')
    const parsed = byteParser.split(buf, MAX_DATABITS, true)

    expect(parsed).toEqual(Buffer.from([0b01, 0b10, 0b00, 0b01, 0b11, 0b11, 0b11, 0b11]))
  })
})

describe('Bits are combined to bytes correctly', () => {
  test('Data is correct', () => {
    const buf = Buffer.from([0b01, 0b10, 0b00, 0b10])
    const parsed = byteParser.combine(buf, MAX_DATABITS)

    expect(parsed).toEqual(Buffer.from('b'))
  })

  test('Data is correct when ending byte is present', () => {
    const buf = Buffer.from([0b01, 0b10, 0b00, 0b10, 0b11, 0b11, 0b11, 0b11])
    const parsed = byteParser.combine(buf, MAX_DATABITS, true)

    expect(parsed).toEqual(Buffer.from('b'))
  })
})
