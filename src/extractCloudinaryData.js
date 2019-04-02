import url from 'url'

// cloudinary image url format:
// https://res.cloudinary.com/<cloud_name>/<resource_type>/<type>/<transformations>/<version>/<public_id>.<format>
const _RE_VERSION = /^v\d+/

export default function (input) {
  if (!input) { return }
  const { hostname, path } = url.parse(input)
  const [, cloudName, resourceType, type, ...rest] = path.split(/\//)
  const base = `${cloudName}/${resourceType}/${type}`
  let version = null
  if (_RE_VERSION.test(rest[0])) {
    // this has a version portion
    version = rest.shift()
  }
  const publicId = rest.join('/')

  return {
    hostname,
    base,
    version,
    publicId
  }
}
