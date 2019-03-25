import url from 'url'

// cloudinary image url format:
// https://res.cloudinary.com/<cloud_name>/<resource_type>/<type>/<transformations>/<version>/<public_id>.<format>
const _RE_VERSION = /^v\d+/

export default function (input) {
  if (!input) { return }
  const { hostname, path } = url.parse(input)
  const [, cloudName, resourceType, type, ...rest] = path.split(/\//)
  const base = `${cloudName}/${resourceType}/${type}`

  let transforms = null
  let version = null
  const publicIdParts = []
  // starting from the end of the remainder of path parts, start looking for the version
  while (rest.length) {
    const current = rest.pop()
    if (!_RE_VERSION.test(current)) {
      // this is not the version, so prepend it to the publicId
      publicIdParts.unshift(current)
    } else {
      // we found the version
      version = current
      break
    }
  }
  if (rest.length) {
    // these are transformations
    transforms = rest.join('/')
  }

  const publicId = publicIdParts.join('/')

  return {
    hostname,
    base,
    transforms,
    version,
    publicId
  }
}
