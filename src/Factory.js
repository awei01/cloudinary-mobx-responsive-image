import { observable, action } from 'mobx'
import Image from './Image'
import resize from './resize'

export default function (configs) {
  configs = configs || {}
  configs.factory = make
  const _Image = Image(configs)

  const _cache = {}

  const _width = observable.box(null)
  const _resize = action(resize.bind(null, _width))

  function make (src) {
    if (!_cache[src]) {
      _cache[src] = _Image(src)
    }
    return _cache[src]
  }
  Object.defineProperty(make, 'width', { value: _width })
  Object.defineProperty(make, 'resize', { value: _resize })

  return make
}
