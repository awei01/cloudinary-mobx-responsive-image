import extractCloudinaryData from '../src/extractCloudinaryData'
import { images } from './fixtures'

export default function (test) {
  test(`extractCloudinaryData()
      called with nothing returns nothing`, (t) => {
    const result = extractCloudinaryData()
    t.falsy(result)
  })

  test(`extractCloudinaryData()
      called with url returns object with [hostname, base, version, publicId] `, (t) => {
    const simple = extractCloudinaryData(images.simple)
    t.deepEqual(simple, {
      hostname: 'res.cloudinary.com',
      base: 'demo/image/upload',
      version: null,
      publicId: 'folder/sample.png'
    })

    const versioned = extractCloudinaryData(images.versioned)
    t.deepEqual(versioned, {
      hostname: 'res.cloudinary.com',
      base: 'demo/image/upload',
      version: 'v1429686295',
      publicId: 'folder/sample.png'
    })
  })
}
