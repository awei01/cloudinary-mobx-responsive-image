import { observable, action } from 'mobx'
import extractImageAttrs from './extractImageAttrs'
import resize from './resize'

const _DEFAULTS = {
  minWidth: 300,
  increment: 100
}

export default function Image (configs, url) {
  // shim vars
  if (arguments.length === 1) {
    if (typeof configs === 'object') {
      return Image.bind(null, configs)
    }
    url = configs
    configs = {}
  }
  const { minWidth, increment, factory } = Object.assign({}, _DEFAULTS, configs)

  const attrs = extractImageAttrs(url)
  const width = factory ? factory.width : observable.box(null)

  function src () {
    const value = _makeWidth({ minWidth, increment }, width.get())
    const transformations = `w_${value}`
    return _interpolateSrc({ ...attrs, transformations })
  }

  const result = {}
  Object.defineProperty(result, 'resize', {
    value: factory
      ? () => {} // noop
      : action(resize.bind(null, width))
  })
  Object.defineProperty(result, 'src', { get: src, enumerable: true })
  return result
}

function _makeWidth (options, width) {
  const { minWidth, increment } = options
  width = width || 0
  width = width < minWidth ? minWidth : width
  const result = Math.ceil(width / increment) * options.increment
  return result
}

function _interpolateSrc ({ hostname, base, transformations, version, publicId }) {
  // cloudinary image url format:
  // https://res.cloudinary.com/<cloud_name>/<resource_type>/<type>/<transformations>/<version>/<public_id>.<format>
  return `//${hostname}/${base}/${transformations}/${version ? version + '/' : ''}${publicId}`
}
