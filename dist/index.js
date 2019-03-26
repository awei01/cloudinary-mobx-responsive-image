'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var mobx = require('mobx');
var _window = _interopDefault(require('window-or-global'));
var url = _interopDefault(require('url'));

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _toArray(arr) {
  return _arrayWithHoles(arr) || _iterableToArray(arr) || _nonIterableRest();
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

// https://res.cloudinary.com/<cloud_name>/<resource_type>/<type>/<transformations>/<version>/<public_id>.<format>

var _RE_VERSION = /^v\d+/;
function extractCloudinaryData (input) {
  if (!input) {
    return;
  }

  var _url$parse = url.parse(input),
      hostname = _url$parse.hostname,
      path = _url$parse.path;

  var _path$split = path.split(/\//),
      _path$split2 = _toArray(_path$split),
      cloudName = _path$split2[1],
      resourceType = _path$split2[2],
      type = _path$split2[3],
      rest = _path$split2.slice(4);

  var base = "".concat(cloudName, "/").concat(resourceType, "/").concat(type);
  var transforms = null;
  var version = null;
  var publicIdParts = []; // starting from the end of the remainder of path parts, start looking for the version

  while (rest.length) {
    var current = rest.pop();

    if (!_RE_VERSION.test(current)) {
      // this is not the version, so prepend it to the publicId
      publicIdParts.unshift(current);
    } else {
      // we found the version
      version = current;
      break;
    }
  }

  if (rest.length) {
    // these are transformations
    transforms = rest.join('/');
  }

  var publicId = publicIdParts.join('/');
  return {
    hostname: hostname,
    base: base,
    transforms: transforms,
    version: version,
    publicId: publicId
  };
}

function resize (observable, value) {
  var current = observable.get(); // only size up, don't size down

  if (current && current > value) {
    return;
  } // console.log('setting width', value)


  observable.set(value);
}

var _DEFAULTS = {
  minWidth: 300,
  maxWidth: Infinity,
  increment: 100
};
function Image(configs, url) {
  // shim vars
  if (arguments.length === 1) {
    if (_typeof(configs) === 'object') {
      return Image.bind(null, configs);
    }

    url = configs;
    configs = {};
  }

  var _Object$assign = Object.assign({}, _DEFAULTS, configs),
      minWidth = _Object$assign.minWidth,
      maxWidth = _Object$assign.maxWidth,
      increment = _Object$assign.increment,
      factory = _Object$assign.factory;

  var attrs = extractCloudinaryData(url);
  var width = factory ? factory.width : mobx.observable.box(null); // observable to track the src

  var _src = mobx.observable.box(_extractSrc());

  var _updateSrc = mobx.action(function () {
    _src.set(_image.src);
  }); // create an image to pre-load the image


  var _image = _makeDOMImage();

  _image.onload = _updateSrc;
  _image.onerror = _updateSrc; // maybe capture disposer? and then allow image to kill the autorun?

  mobx.autorun(function () {
    var src = _extractSrc();

    if (_image.src !== src) {
      _image.src = src;
    }
  }); // function to generate the src url of image

  function _extractSrc() {
    var value = _makeWidth({
      minWidth: minWidth,
      maxWidth: maxWidth,
      increment: increment
    }, width.get());

    var transformations = "w_".concat(value);
    return _interpolateSrc(_objectSpread({}, attrs, {
      transformations: transformations
    }));
  }

  var result = {};
  Object.defineProperty(result, 'resize', {
    value: factory ? function () {} // noop
    : mobx.action(resize.bind(null, width))
  });
  Object.defineProperty(result, 'src', {
    get: function get() {
      return _src.get();
    },
    enumerable: true
  });
  return result;
}

function _makeWidth(options, width) {
  var minWidth = options.minWidth,
      maxWidth = options.maxWidth,
      increment = options.increment;
  width = width || 0;
  width = width < minWidth ? minWidth : width;
  width = width > maxWidth ? maxWidth : width;
  var result = Math.ceil(width / increment) * options.increment;
  return result;
}

function _interpolateSrc(_ref) {
  var hostname = _ref.hostname,
      base = _ref.base,
      transforms = _ref.transforms,
      transformations = _ref.transformations,
      version = _ref.version,
      publicId = _ref.publicId;
  // cloudinary image url format:
  // https://res.cloudinary.com/<cloud_name>/<resource_type>/<type>/<transformations>/<version>/<public_id>.<format>
  return "//".concat(hostname, "/").concat(base, "/").concat(transforms ? transforms + '/' : '').concat(transformations, "/").concat(version ? version + '/' : '').concat(publicId);
}

function _makeDOMImage() {
  var Image = _window.Image;

  if (Image) {
    return new Image();
  } // for non-browser environment isomorphic apps


  var _src;

  var fakeImage = {
    get src() {
      return _src;
    },

    set src(value) {
      _src = value;
      this.onload && this.onload();
    }

  };
  return fakeImage;
}

function Factory (configs) {
  configs = configs || {};
  configs.factory = make;

  var _Image = Image(configs);

  var _cache = {};

  var _width = mobx.observable.box(null);

  var _resize = mobx.action(resize.bind(null, _width));

  function make(src) {
    if (!_cache[src]) {
      _cache[src] = _Image(src);
    }

    return _cache[src];
  }

  Object.defineProperty(make, 'width', {
    value: _width
  });
  Object.defineProperty(make, 'resize', {
    value: _resize
  });
  return make;
}

exports.Factory = Factory;
exports.Image = Image;
