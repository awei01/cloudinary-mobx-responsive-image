import { observable, action, autorun } from 'mobx'
import _window from 'window-or-global'
import extractCloudinaryData from './extractCloudinaryData'
import resize from './resize'
import stripSlashes from './stripSlashes'

const _DEFAULTS = {
  minWidth: 300,
  maxWidth: Infinity,
  increment: 100
}

export default function Image (configs, url, transforms) {
  // shim vars
  if (arguments.length === 1 && typeof configs === 'object') {
    // we're making an Image function bound to configs
    return Image.bind(null, configs)
  }
  if (typeof configs !== 'object') {
    transforms = url
    url = configs
    configs = {}
  }
  transforms = stripSlashes(transforms)

  const { minWidth, maxWidth, increment, factory } = Object.assign({}, _DEFAULTS, configs)

  const attrs = extractCloudinaryData(url)
  const width = factory ? factory.width : observable.box(null)

  // observable to track the src
  const _src = observable.box(_extractSrc())
  const _updateSrc = action(() => {
    _src.set(_image.src)
  })
  // create an image to pre-load the image
  const _image = _makeDOMImage()
  _image.onload = _updateSrc
  _image.onerror = _updateSrc

  // maybe capture disposer? and then allow image to kill the autorun?
  autorun(() => {
    const src = _extractSrc()
    if (_image.src !== src) {
      _image.src = src
    }
  })

  // function to generate the src url of image
  function _extractSrc () {
    const value = _makeWidth({ minWidth, maxWidth, increment }, width.get())
    const transformations = `w_${value}`
    return _interpolateSrc({ ...attrs, transforms, transformations })
  }

  const result = {}
  Object.defineProperty(result, 'resize', {
    value: factory
      ? () => {} // noop
      : action(resize.bind(null, width))
  })
  Object.defineProperty(result, 'src', { get: () => { return _src.get() }, enumerable: true })
  return result
}

function _makeWidth (options, width) {
  const { minWidth, maxWidth, increment } = options
  width = width || 0
  width = width < minWidth ? minWidth : width
  width = width > maxWidth ? maxWidth : width
  const result = Math.ceil(width / increment) * options.increment
  return result
}

function _interpolateSrc ({ hostname, base, transforms, transformations, version, publicId }) {
  // cloudinary image url format:
  // https://res.cloudinary.com/<cloud_name>/<resource_type>/<type>/<transformations>/<version>/<public_id>.<format>
  return `//${hostname}/${base}/${transforms ? transforms + '/' : ''}${transformations}/${version ? version + '/' : ''}${publicId}`
}

function _makeDOMImage () {
  const { Image } = _window
  if (Image) { return new Image() }

  // for non-browser environment isomorphic apps
  let _src
  const fakeImage = {
    get src () {
      return _src
    },
    set src (value) {
      _src = value
      this.onload && this.onload()
    }
  }
  return fakeImage
}
