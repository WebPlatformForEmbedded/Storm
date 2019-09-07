import executeAsPromise from './executeAsPromise'

const runValidate = (context, validate, expected) => {
  return new Promise((resolve, reject) => {
    executeAsPromise(validate, [expected], context)
      .then(result => {
        return result === false ? reject(new Error('Validation failed')) : resolve(result)
      })
      .catch(e => {
        reject(e)
      })
  })
}

export default runValidate
