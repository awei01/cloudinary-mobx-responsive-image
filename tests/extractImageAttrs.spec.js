import extractImageAttrs from '../src/extractImageAttrs'
import { images } from './fixtures'

export default function (test) {
  test(`extractImageAttrs()
      called with nothing returns nothing`, (t) => {
    const result = extractImageAttrs()
    t.falsy(result)
  })

  test(`extractImageAttrs()
      called with url returns object with [hostname, base, version, publicId] `, (t) => {
    const simple = extractImageAttrs(images.simple)
    t.deepEqual(simple, {
      hostname: 'res.cloudinary.com',
      base: 'demo/image/upload',
      version: null,
      publicId: 'folder/sample.png'
    })

    const versioned = extractImageAttrs(images.versioned)
    t.deepEqual(versioned, {
      hostname: 'res.cloudinary.com',
      base: 'demo/image/upload',
      version: 'v1429686295',
      publicId: 'folder/sample.png'
    })
  })
}
