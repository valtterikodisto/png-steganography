# Week 1

[Hour reporting](./hours.md)

## What happened in week 1

- Project design
- Project setup
- Version control setup

The idea of writing a steganography application was clear from the beginning. However I spent significant amount of time planning which data structures and algorithms I should use since the initial idea was a rather simple one and did not involve much of them.

I came to a conclusion that I will use sorting (merge sort) and queue (double-ended queue). Should the dequeue be inadequate, there is also a possibility to use stack in encryption key usage.

## Problems

TL;DR <br/>

> Hiding data in too light or too dark pixel will be hard

There was a major problem with the decision to use sorting. I wanted to sort the individual pixel based on its RGB sum (R + G + B) so that the dark colors are first and light colors are last. However if I sorted first and then changed the [LSB](https://en.wikipedia.org/wiki/Bit_numbering#Least_significant_bit) it could change the order of the pixels.

The solution I came up with RGB:

R: `1001 0100` <= balance bits <br/>
G: `0001 0101` <= balance bits <br/>
B: `1011 0100` <= data bits <br/>

I could use bits in red and green to balance bits so that the RGB sum will remain unchanged. But what if balance bits are too small or too big to balance change in data bits? I came up with a solution that I could lighten/darken red or green in pixels which it was too high/low.

## Questions

1. Documentation of PNG seemed complicated and could potentially be time-consuming to extract all the necessary information from it let alone implement it. Can I use [pngjs](https://www.npmjs.com/package/pngjs) to read/write RGB data from/to the PNG file?

2. Is it enough to use and implement merge sort and dequeue?

## Next week

The following week I will start with the first step of hiding the data: reading a PNG file and preparing it so that it can continue to the sorting phase.
