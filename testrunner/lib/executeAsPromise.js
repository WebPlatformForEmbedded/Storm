export default (method, args, context) => {
  let result
  if (method && typeof method === 'function') {
    result = method.apply(context, args)
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
