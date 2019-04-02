import test from 'ava'
import Image from '../src/Image'
import { images } from './helpers/fixtures'

test(`Image()
    called with [image] returns object`, (t) => {
  const result = Image(images.simple)
  t.truthy(typeof result === 'object')
})

test(`Image()
    called with [image] returns { src } with default width`, (t) => {
  const simple = Image(images.simple)
  t.is(simple.src, '//res.cloudinary.com/demo/image/upload/w_300/folder/sample.png')

  const versioned = Image(images.versioned)
  t.is(versioned.src, '//res.cloudinary.com/demo/image/upload/w_300/v1429686295/folder/sample.png')
})

test(`Image()
    called with [image] returns { src, resize }
    can resize to larger sizes rounding up to next factor of 100`, (t) => {
  const simple = Image(images.simple)
  simple.resize(350)
  t.is(simple.src, '//res.cloudinary.com/demo/image/upload/w_400/folder/sample.png')
  simple.resize(450)
  t.is(simple.src, '//res.cloudinary.com/demo/image/upload/w_500/folder/sample.png')
  simple.resize(899)
  t.is(simple.src, '//res.cloudinary.com/demo/image/upload/w_900/folder/sample.png')
})

test(`Image()
    called with [{ minWidth, maxWidth, increment }, image]
    resizes based upon configs`, (t) => {
  const simple = Image({ minWidth: 100, maxWidth: 200, increment: 50 }, images.simple)
  t.is(simple.src, '//res.cloudinary.com/demo/image/upload/w_100/folder/sample.png')
  simple.resize(101)
  t.is(simple.src, '//res.cloudinary.com/demo/image/upload/w_150/folder/sample.png')
  simple.resize(151)
  t.is(simple.src, '//res.cloudinary.com/demo/image/upload/w_200/folder/sample.png')
  simple.resize(201)
  t.is(simple.src, '//res.cloudinary.com/demo/image/upload/w_200/folder/sample.png')
})

test(`Image()
    called with [image, transforms]
    resizes with transforms`, (t) => {
  let img
  img = Image(images.simple, 'transforms')
  t.is(img.src, '//res.cloudinary.com/demo/image/upload/transforms/w_300/folder/sample.png')
  img.resize(301)
  t.is(img.src, '//res.cloudinary.com/demo/image/upload/transforms/w_400/folder/sample.png')

  img = Image(images.simple, '//transforms')
  t.is(img.src, '//res.cloudinary.com/demo/image/upload/transforms/w_300/folder/sample.png')

  img = Image(images.simple, 'transforms//')
  t.is(img.src, '//res.cloudinary.com/demo/image/upload/transforms/w_300/folder/sample.png')
})

