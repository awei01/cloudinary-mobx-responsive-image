import { observable, action } from 'mobx'
import Image from './Image'
import resize from './resize'
import stripSlashes from './stripSlashes'

export default function (configs) {
  configs = configs || {}
  configs.factory = make
  const _Image = Image(configs)

  const baseURL = stripSlashes(configs.baseURL)

  const _cache = {}

  const _width = observable.box(null)
  const _resize = action(resize.bind(null, _width))

  function make (src, transforms) {
    src = stripSlashes(src)
    transforms = stripSlashes(transforms)
    const url = baseURL ? `${baseURL}/${src}` : src
    const key = `${src}@${transforms}`
    if (!_cache[key]) {
      _cache[key] = _Image(url, transforms)
    }
    return _cache[key]
  }
  Object.defineProperty(make, 'width', { value: _width })
  Object.defineProperty(make, 'resize', { value: _resize })

  return make
}
