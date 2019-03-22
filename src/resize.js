export default function (observable, value) {
  const current = observable.get()
  // only size up, don't size down
  if (current && current > value) { return }
  // console.log('setting width', value)
  observable.set(value)
}
