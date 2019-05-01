export default (method, args) => {
  let result

  if (method && typeof method === 'function') {
    result = method.apply(null, args)
  }

  // not a promise, so let's return one
  if (!(result && result.then && typeof result.then === 'function')) {
    return new Promise(resolve => {
      resolve(result)
    })
  }
  // return the existing promise
  else {
    return result
  }
}
