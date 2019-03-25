import test from 'ava'
import extractCloudinaryData from '../src/extractCloudinaryData'
import { images } from './helpers/fixtures'

test(`extractCloudinaryData()
    called with nothing returns nothing`, (t) => {
  const result = extractCloudinaryData()
  t.falsy(result)
})

test(`extractCloudinaryData()
    called with url without version returns object with [hostname, base, transforms, version, publicId] `, (t) => {
  const simple = extractCloudinaryData(images.simple)
  t.deepEqual(simple, {
    hostname: 'res.cloudinary.com',
    base: 'demo/image/upload',
    transforms: null,
    version: null,
    publicId: 'folder/sample.png'
  })
})

test(`extractCloudinaryData()
    called with url with version returns object with [hostname, base, transforms, version, publicId] `, (t) => {
  const versioned = extractCloudinaryData(images.versioned)
  t.deepEqual(versioned, {
    hostname: 'res.cloudinary.com',
    base: 'demo/image/upload',
    transforms: null,
    version: 'v1429686295',
    publicId: 'folder/sample.png'
  })
})

test(`extractCloudinaryData()
    called with url with transforms and version returns object with [hostname, base, transforms, version, publicId] `, (t) => {
  const transformed = extractCloudinaryData(images.transformed)
  t.deepEqual(transformed, {
    hostname: 'res.cloudinary.com',
    base: 'demo/image/upload',
    transforms: 'c_crop,g_auto:faces,h_500,w_500',
    version: 'v1429686295',
    publicId: 'folder/sample.png'
  })
})
