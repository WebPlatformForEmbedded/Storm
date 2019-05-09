import dotObjectKey from './lib/dotObjectKey'

export default (test, step, reporter, index) => {
  // todo: more / better validations of step
  if ('description' in step === false) {
    throw Error('No description supplied for step')
  }

  // setup default validate function if doesn't exist
  if ('validate' in step === false) {
    if ('params' in step === false) {
      step.params = true
    }
    if ('assert' in step === false) {
      step.assert = step.params
    }
    step.validate = x => {
      return x === step.assert
    }
  }

  const validate = (step, result, resolve, reject) => {
    try {
      if (step.validate.call(step, result) === true) {
        return resolve(result)
      } else {
        return reject(new Error('Validation failed'))
      }
    } catch (e) {
      reject(e)
    }
  }

  // merge in some extra functionalality in the step
  step = {
    ...step,
    ...{
      context(key) {
        return dotObjectKey(test.context, key)
      },
    },
  }

  return {
    exec() {
      return new Promise((resolve, reject) => {
        if ('sleep' in step) {
          if (typeof step.sleep === 'function') {
            step.sleep = step.sleep()
          }
          reporter.log('Sleeping for ' + step.sleep + ' seconds')
        }

        setTimeout(() => {
          reporter.log((index > 0 ? 'Repeating (' + index + ') ' : 'Executing ') + step.description)

          let result
          try {
            result = step.test.apply(
              step,
              step.params instanceof Array ? step.params : [step.params]
            )
          } catch (e) {
            return reject(e)
          }

          // asynchronous test function
          if (result.then && typeof result.then === 'function') {
            result
              .then(res => {
                validate(step, res, resolve, reject)
              })
              .catch(err => {
                return reject(err)
              })
          }
          // synchronous test function
          else {
            validate(step, result, resolve, reject)
          }
        }, Number(step.sleep) * 1000 || 500)
      })
    },
  }
}
