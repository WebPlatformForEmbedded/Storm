import executeAsPromise from './executeAsPromise'

const runValidate = (context, validate, expected) => {
  return new Promise((resolve, reject) => {
    executeAsPromise(validate, [expected], context)
      .then(result => {
        return result === true
          ? resolve(result)
          : reject(new Error(`Validation failed, expected 'true' got '${result}'`))
      })
      .catch(e => {
        reject(e)
      })
  })
}

export default runValidate
