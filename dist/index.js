'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var mobx = require('mobx');
var _window = _interopDefault(require('window-or-global'));
var url = _interopDefault(require('url'));

// cloudinary image url format:
// https://res.cloudinary.com/<cloud_name>/<resource_type>/<type>/<transformations>/<version>/<public_id>.<format>
const _RE_VERSION = /^v\d+/;

function extractCloudinaryData (input) {
  if (!input) { return }
  const { hostname, path } = url.parse(input);
  const [, cloudName, resourceType, type, ...rest] = path.split(/\//);
  const base = `${cloudName}/${resourceType}/${type}`;

  let transforms = null;
  let version = null;
  const publicIdParts = [];
  // starting from the end of the remainder of path parts, start looking for the version
  while (rest.length) {
    const current = rest.pop();
    if (!_RE_VERSION.test(current)) {
      // this is not the version, so prepend it to the publicId
      publicIdParts.unshift(current);
    } else {
      // we found the version
      version = current;
      break
    }
  }
  if (rest.length) {
    // these are transformations
    transforms = rest.join('/');
  }

  const publicId = publicIdParts.join('/');

  return {
    hostname,
    base,
    transforms,
    version,
    publicId
  }
}

function resize (observable, value) {
  const current = observable.get();
  // only size up, don't size down
  if (current && current > value) { return }
  // console.log('setting width', value)
  observable.set(value);
}

const _DEFAULTS = {
  minWidth: 300,
  maxWidth: Infinity,
  increment: 100
};

function Image (configs, url) {
  // shim vars
  if (arguments.length === 1) {
    if (typeof configs === 'object') {
      return Image.bind(null, configs)
    }
    url = configs;
    configs = {};
  }
  const { minWidth, maxWidth, increment, factory } = Object.assign({}, _DEFAULTS, configs);

  const attrs = extractCloudinaryData(url);
  const width = factory ? factory.width : mobx.observable.box(null);

  // observable to track the src
  const _src = mobx.observable.box(_extractSrc());
  const _updateSrc = mobx.action(() => {
    _src.set(_image.src);
  });
  // create an image to pre-load the image
  const _image = _makeDOMImage();
  _image.onload = _updateSrc;
  _image.onerror = _updateSrc;

  // maybe capture disposer? and then allow image to kill the autorun?
  mobx.autorun(() => {
    const src = _extractSrc();
    if (_image.src !== src) {
      _image.src = src;
    }
  });

  // function to generate the src url of image
  function _extractSrc () {
    const value = _makeWidth({ minWidth, maxWidth, increment }, width.get());
    const transformations = `w_${value}`;
    return _interpolateSrc({ ...attrs, transformations })
  }

  const result = {};
  Object.defineProperty(result, 'resize', {
    value: factory
      ? () => {} // noop
      : mobx.action(resize.bind(null, width))
  });
  Object.defineProperty(result, 'src', { get: () => { return _src.get() }, enumerable: true });
  return result
}

function _makeWidth (options, width) {
  const { minWidth, maxWidth, increment } = options;
  width = width || 0;
  width = width < minWidth ? minWidth : width;
  width = width > maxWidth ? maxWidth : width;
  const result = Math.ceil(width / increment) * options.increment;
  return result
}

function _interpolateSrc ({ hostname, base, transforms, transformations, version, publicId }) {
  // cloudinary image url format:
  // https://res.cloudinary.com/<cloud_name>/<resource_type>/<type>/<transformations>/<version>/<public_id>.<format>
  return `//${hostname}/${base}/${transforms ? transforms + '/' : ''}${transformations}/${version ? version + '/' : ''}${publicId}`
}

function _makeDOMImage () {
  const { Image } = _window;
  if (Image) { return new Image() }

  // for non-browser environment isomorphic apps
  let _src;
  const fakeImage = {
    get src () {
      return _src
    },
    set src (value) {
      _src = value;
      this.onload && this.onload();
    }
  };
  return fakeImage
}

function Factory (configs) {
  configs = configs || {};
  configs.factory = make;
  const _Image = Image(configs);

  const _cache = {};

  const _width = mobx.observable.box(null);
  const _resize = mobx.action(resize.bind(null, _width));

  function make (src) {
    if (!_cache[src]) {
      _cache[src] = _Image(src);
    }
    return _cache[src]
  }
  Object.defineProperty(make, 'width', { value: _width });
  Object.defineProperty(make, 'resize', { value: _resize });

  return make
}

exports.Factory = Factory;
exports.Image = Image;
