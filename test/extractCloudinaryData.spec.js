import test from 'ava'
import extractCloudinaryData from '../src/extractCloudinaryData'
import { images } from './helpers/fixtures'

test(`extractCloudinaryData()
    called with nothing returns nothing`, (t) => {
  const result = extractCloudinaryData()
  t.falsy(result)
})

test(`extractCloudinaryData()
    called with url without version returns object with [hostname, base, version, publicId] `, (t) => {
  const simple = extractCloudinaryData(images.simple)
  t.deepEqual(simple, {
    hostname: 'res.cloudinary.com',
    base: 'demo/image/upload',
    version: null,
    publicId: 'folder/sample.png'
  })
})

test(`extractCloudinaryData()
    called with url with version returns object with [hostname, base, version, publicId] `, (t) => {
  const versioned = extractCloudinaryData(images.versioned)
  t.deepEqual(versioned, {
    hostname: 'res.cloudinary.com',
    base: 'demo/image/upload',
    version: 'v1429686295',
    publicId: 'folder/sample.png'
  })
})
