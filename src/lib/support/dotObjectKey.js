export const get = (obj, key) => {
  const keys = key.split('.')

  for (let i = 0; i < keys.length; i++) {
    if (obj === null) return obj
    obj = obj[keys[i]] = typeof obj[keys[i]] !== 'undefined' ? obj[keys[i]] : null
  }

  return obj
}

export const assign = (obj, keys, value) => {
  keys = keys.split('.')

  keys.reduce((o, key, index) => {
    if (index === keys.length - 1) {
      return (o[key] = value)
    }
    return (o[key] = o[key] || {})
  }, obj)

  return obj
}

export default {
  get,
  assign,
}
