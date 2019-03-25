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
    called with [image] returns { src, resize }
    resizes to larger sizes, but when resized smaller keeps largest size`, (t) => {
  const simple = Image(images.simple)
  simple.resize(800)
  t.is(simple.src, '//res.cloudinary.com/demo/image/upload/w_800/folder/sample.png')
  simple.resize(799)
  t.is(simple.src, '//res.cloudinary.com/demo/image/upload/w_800/folder/sample.png')
  simple.resize(700)
  t.is(simple.src, '//res.cloudinary.com/demo/image/upload/w_800/folder/sample.png')
  simple.resize(699)
  t.is(simple.src, '//res.cloudinary.com/demo/image/upload/w_800/folder/sample.png')
})

test(`Image()
    having transforms
    appends resize after base transforms`, (t) => {
  const transformed = Image(images.transformed)
  transformed.resize(800)
  t.is(transformed.src, '//res.cloudinary.com/demo/image/upload/c_crop,g_auto:faces,h_500,w_500/w_800/v1429686295/folder/sample.png')
})

test(`Image()
    called with [options] returns Image function configured options`, (t) => {
  const myImage = Image({ minWidth: 200, increment: 200 })
  const simple = myImage(images.simple)
  t.is(simple.src, '//res.cloudinary.com/demo/image/upload/w_200/folder/sample.png')
  simple.resize(299)
  t.is(simple.src, '//res.cloudinary.com/demo/image/upload/w_400/folder/sample.png')
  simple.resize(801)
  t.is(simple.src, '//res.cloudinary.com/demo/image/upload/w_1000/folder/sample.png')
})
