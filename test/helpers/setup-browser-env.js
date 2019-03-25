import browserEnv from 'browser-env'
browserEnv(['window'])
global.window.Image = FakeImage

function FakeImage (src) {
  if (src) {
    this._src = src
  }
}
Object.defineProperty(FakeImage.prototype, 'src', {
  get () {
    return this._src
  },
  set (value) {
    this._src = value
    this.onload && this._src && this.onload()
  },
  enumerable: true
})
