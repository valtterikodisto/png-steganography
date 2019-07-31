const Pixel = require('../src/image/pixel')
const { MAX_DATABITS } = require('../config/index')

describe('Too bright or too dark pixel is balanced correctly', () => {
  test('Normal but bright pixel remains intact', () => {
    const pixel = new Pixel(255, 255 - MAX_DATABITS, 111, 255, 0, 0)
    pixel.adjustHighAndLow()
    expect(pixel).toEqual(new Pixel(255, 255 - MAX_DATABITS, 111, 255, 0, 0))
  })

  test('Normal but dark pixel remains intact', () => {
    const pixel = new Pixel(0, MAX_DATABITS, 20, 255, 0, 0)
    pixel.adjustHighAndLow()
    expect(pixel).toEqual(new Pixel(0, MAX_DATABITS, 20, 255, 0, 0))
  })

  test('Too bright pixel is adjusted correctly', () => {
    const pixel = new Pixel(253, 254, 0, 255, 0, 0)
    pixel.adjustHighAndLow()
    expect(pixel.red + pixel.green).toBe(510 - MAX_DATABITS)
  })

  test('Too dark pixel is adjusted correctly', () => {
    const pixel = new Pixel(0, 0, 0, 255, 0, 0)
    pixel.adjustHighAndLow()
    expect(pixel.red + pixel.green).toBe(MAX_DATABITS)
  })
})

describe('Data is hidden correctly in a pixel', () => {
  test('In a red pixel', () => {
    const red = 255
    const green = 0
    const blue = 0b101
    const pixel = new Pixel(red, green, blue, 255, 0, 0)
    pixel.hideData(0b11)
    expect(pixel.extractData()).toBe(0b11)
    expect(pixel.red + pixel.green + pixel.blue).toBe(red + green + blue)
  })

  test('In a green pixel', () => {
    const red = 0
    const green = 255
    const blue = 0b100
    const pixel = new Pixel(red, green, blue, 255, 0, 0)
    pixel.hideData(0b01)
    expect(pixel.extractData()).toBe(0b01)
    expect(pixel.red + pixel.green + pixel.blue).toBe(red + green + blue)
  })

  test('In a blue pixel', () => {
    const red = 3
    const green = 0
    const blue = 255
    const pixel = new Pixel(red, green, blue, 255, 0, 0)
    pixel.hideData(0)
    expect(pixel.extractData()).toBe(0)
    expect(pixel.red + pixel.green + pixel.blue).toBe(red + green + blue)
  })

  test('In white pixel', () => {
    const red = 254
    const green = 253
    const blue = 254
    const pixel = new Pixel(red, green, blue, 255, 0, 0)
    pixel.hideData(0b11)
    expect(pixel.extractData()).toBe(0b11)
    expect(pixel.red + pixel.green + pixel.blue).toBe(red + green + blue)
  })

  test('In black pixel', () => {
    const pixel = new Pixel(0, 0, 0, 0, 20, 0)
    pixel.adjustHighAndLow()
    pixel.hideData(0b11)
    expect(pixel.rgbSum()).toEqual(MAX_DATABITS)
  })
})
