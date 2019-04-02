export default function (input) {
  return input && input.replace(/^\/+/, '').replace(/\/+$/, '')
}
