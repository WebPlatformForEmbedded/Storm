export default (obj, key) => {
  const keys = key.split('.')

  for (let i = 0; i < keys.length; i++) {
    obj = obj[keys[i]] = obj[keys[i]] || {}
  }

  return obj
}
