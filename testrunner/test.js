import contra from 'contra'
import Step from './step'
import executeAsPromise from './lib/executeAsPromise'

export default (test, reporter, device) => {
  const runSetup = method => {
    if (method && typeof method === 'function') {
      reporter.log('Running Test Setup')
    }
    return executeAsPromise(method)
  }

  const runTeardown = method => {
    if (method && typeof method === 'function') {
      reporter.log('Running Test Teardown')
    }
    return executeAsPromise(method)
  }

  const runSteps = steps => {
    return new Promise((resolve, reject) => {
      contra.each.series(
        steps,
        (step, next) => {
          reporter.step(test, step)

          // make device info available in the step as this.device
          step.device = device

          // repeat steps (defaults to only once)
          contra.each.series(
            Array(step.repeat || 1).fill(step),
            (repeatStep, index, repeat) => {
              runStep(repeatStep, index)
                .then(() => {
                  repeat()
                })
                .catch(err => next(err))
            },
            err => {
              next(err)
            }
          )
        },
        err => {
          err ? reject(err) : resolve()
        }
      )
    })
  }

  const runStep = (step, index) => {
    return new Promise((resolve, reject) => {
      try {
        return Step(step, reporter, index)
          .exec()
          .then(() => {
            reporter.pass(test, step)
            resolve()
          })
          .catch(err => {
            reporter.fail(test, step, err)
            reject(err)
          })
      } catch (e) {
        reject(e)
      }
    })
  }

  return {
    exec() {
      reporter.init(test)

      return new Promise((resolve, reject) => {
        contra.series(
          [
            // first run setup of test
            next => {
              runSetup(test.setup)
                .then(next)
                .catch(e => {
                  next(e)
                })
            },
            // run the steps
            next => {
              runSteps(test.steps)
                .then(next)
                .catch(e => {
                  next(e)
                })
            },
            // after steps run teardown
            next => {
              runTeardown(test.tearDown)
                .then(next)
                .catch(e => {
                  next(e)
                })
            },
          ],
          // done!
          (err, results) => {
            if (err) {
              reporter.error(test, err)
              reject(err)
            } else {
              reporter.success(test)
              resolve(results)
            }
          }
        )
      })
    },
  }
}
