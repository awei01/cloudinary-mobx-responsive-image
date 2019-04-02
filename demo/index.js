import React from 'react'
import ReactDom from 'react-dom'
import { observer } from 'mobx-react'
import Factory from '~/Factory'
import Image from '~/Image'

const makeImage = Factory({
  minWidth: 100,
  increment: 50
})

function _getDocWidth () {
  const { width } = window.document.body.getBoundingClientRect()
  // console.log('body width is', width)
  return width
}

class _TestApp extends React.Component {
  constructor (props) {
    super(props)
    this.handleResize = this.handleResize.bind(this)
    this._imagesFromFactory = [
      makeImage('http://res.cloudinary.com/demo/image/upload/sample.png'),
      makeImage('http://res.cloudinary.com/demo/image/upload/lady.gif'),
      makeImage('http://res.cloudinary.com/demo/image/upload/v1429686295/sample.jpg', '/c_crop,w_300,h_300')
    ]
    this._image = Image('http://res.cloudinary.com/demo/image/upload/woman.png')
  }
  handleResize () {
    const width = _getDocWidth()
    makeImage.resize(width)
    this._image.resize(width)
  }
  componentDidMount () {
    window.onresize = this.handleResize
    // initial load
    this.handleResize()
  }
  render () {
    return (
      <div>
        { this.renderImagesFromFactory() }
        { this.renderImage() }
        { this.renderDebug() }
      </div>
    )
  }
  renderImagesFromFactory () {
    return (
      <div>
        <h2>From Factory</h2>
        { this._imagesFromFactory.map((image, index) => {
          return (<div key={index}><img src={image.src} /></div>)
        })}
      </div>
    )
  }
  renderImage () {
    return (
      <div>
        <h2>Image</h2>
        <img src={this._image.src} />
      </div>
    )
  }
  renderDebug () {
    return (
      <pre>
        this._imagesFromFactory: { JSON.stringify(this._imagesFromFactory, null, 2) }
        ---
        this._image: { JSON.stringify(this._image, null, 2) }
      </pre>
    )
  }
}
const TestApp = observer(_TestApp)

ReactDom.render(
  (<TestApp />),
  document.getElementById('app')
)
