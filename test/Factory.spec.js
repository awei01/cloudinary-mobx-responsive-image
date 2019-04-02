import test from 'ava'
import Factory from '../src/Factory'
import { images } from './helpers/fixtures'

test(`Factory()
    called with [configs] returns function`, (t) => {
  const result = Factory({})
  t.truthy(typeof result === 'function')
})

test(`Factory()
    called with [configs] returns makeFn
    makeFn() called with [image] can resize image with makeFn.resize()`, (t) => {
  const make = Factory({})
  const image = make(images.simple)
  t.is(image.src, '//res.cloudinary.com/demo/image/upload/w_300/folder/sample.png')
  make.resize(301)
  t.is(image.src, '//res.cloudinary.com/demo/image/upload/w_400/folder/sample.png')
})

test(`Factory()
    called with { baseURL } returns makeFn()
    makeFn() called with [image] returns image with baseURL`, (t) => {
  let make, image

  make = Factory({ baseURL: 'http://hostname/id/type/resource/' })
  image = make('path/image.jpg')
  t.is(image.src, '//hostname/id/type/resource/w_300/path/image.jpg')

  // it can resolve the baseURL
  make = Factory({ baseURL: 'http://hostname/id/type/resource' })
  image = make('path/image.jpg')
  t.is(image.src, '//hostname/id/type/resource/w_300/path/image.jpg')

  // it can resolve the image path
  make = Factory({ baseURL: 'http://hostname/id/type/resource/' })
  image = make('/path/image.jpg')
  t.is(image.src, '//hostname/id/type/resource/w_300/path/image.jpg')
 })

test(`Factory()
    makeFn() called with [image, transforms] returns image with baseURL`, (t) => {
  let make, image

  make = Factory()
  image = make(images.simple, 'transforms')
  t.is(image.src, '//res.cloudinary.com/demo/image/upload/transforms/w_300/folder/sample.png')

  // it can resolve the baseURL
  make = Factory({ baseURL: 'http://hostname/id/type/resource/' })
  image = make('path/image.jpg', 'transforms')
  t.is(image.src, '//hostname/id/type/resource/transforms/w_300/path/image.jpg')
 })
