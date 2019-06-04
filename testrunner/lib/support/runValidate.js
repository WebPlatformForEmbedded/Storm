const runValidate = (context, validate, result) => {
  return new Promise((resolve, reject) => {
    if (validate && typeof validate === 'function') {
      try {
        if (validate.call(context, result) === true) {
          return resolve()
        } else {
          return reject(new Error('Validation failed'))
        }
      } catch (e) {
        reject(e)
      }
    }
    // if no validate method, just resolve
    else {
      resolve()
    }
  })
}

export default runValidate
