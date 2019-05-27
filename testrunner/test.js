import Contra from 'contra'
import Step from './step'
import dotObjectKey from './lib/dotObjectKey'

import {
  shouldRepeat,
  shouldRunSetup,
  shouldRunTeardown,
  runSetup,
  runTeardown,
  runValidate,
  calculateSleep,
  calculateRepeat,
} from './support'

const runTest = function(index) {
  return new Promise((resolve, reject) => {
    const sleep = calculateSleep(this.test.sleep)

    if (sleep) {
      this.reporter.sleep(sleep)
    }
    setTimeout(
      () => {
        this.reporter.log(
          (index > 0 ? 'Repeating (' + index + ') ' : 'Executing ') + this.test.title
        )

        Contra.series(
          [
            // 1) test setup
            next => {
              shouldRunSetup(this.test.repeat, index)
                ? runSetup(this, this.test.setup)
                    .then(next)
                    .catch(e => {
                      next(e)
                    })
                : next()
            },
            // 2) test steps
            next => {
              runSteps
                .call(this, this.test.steps)
                .then(next)
                .catch(e => {
                  next(e)
                })
            },
            // 3) test validate
            next => {
              runValidate(this.test, this.test.validate)
                .then(next)
                .catch(e => {
                  next(e)
                })
            },
            //  4) test teardown (should this be in the done step to make sure it *always* runs?)
            next => {
              shouldRunTeardown(this.test.repeat, index)
                ? runTeardown(this, this.test.teardown)
                    .then(next)
                    .catch(e => {
                      next(e)
                    })
                : next()
            },
          ],
          // 5) done
          (err, results) => {
            if (err) {
              this.reporter.error(this.test, err)
              reject(err)
            } else {
              this.reporter.success(this.test)
              resolve()
            }
          }
        )
      },
      // unless sleep is specified, sleep for 500ms between repeating a test (but not on the first run!)
      sleep ? sleep : Math.min(1, index) * 500
    )
  })
}

const runSteps = function(steps) {
  return new Promise((resolve, reject) => {
    Contra.each.series(
      steps,
      (step, next) => {
        // sub test
        if (step.steps) {
          step = { ...step, ...{ context: this.test.context, data: this.test.data } }
          makeTest(step, this.reporter)
            .exec()
            .then(next)
            .catch(e => next(e))
        } else {
          Step(this.test, step, this.reporter)
            .exec()
            .then(() => {
              next()
            })
            .catch(e => next(e))
        }
      },
      err => {
        err ? reject(err) : resolve()
      }
    )
  })
}

const Mixin = function() {
  return {
    $log: this.reporter.log,
    $context: {
      read: function(key) {
        return dotObjectKey.get(this.context, key)
      }.bind(this),
    },
    $data: {
      read: function(key) {
        return dotObjectKey.get(this.data, key)
      }.bind(this),
      store: function(key, value) {
        dotObjectKey.assign(this.data, key, value)
      }.bind(this),
    },
    // $http,
    // $moment,
  }
}

const makeTest = (testCase, reporter) => {
  const defaults = {
    data: {},
    context: {},
  }

  // calculate repeat
  testCase.repeat = calculateRepeat(testCase.repeat)

  return {
    reporter,
    test: Object.assign(
      // Mixin functionality into the test case
      Object.create(Mixin.call({ ...defaults, ...testCase, ...{ reporter } })),
      { ...defaults, ...testCase }
    ),
    exec() {
      // execue the test (multiple times depending on repeat)
      return new Promise((resolve, reject) => {
        let index = 0
        let start = new Date()
        let error = null

        const queue = Contra.queue((job, done) => {
          runTest
            .call(job, index)
            .then(() => {
              done()
              if (shouldRepeat(job.test, job.test.repeat, index, start)) {
                queue.push(job, () => {
                  index++
                })
              }
            })
            .catch(err => {
              error = err
              reject(err)
              done()
            })
        })

        queue.push(this, () => {
          index++
        })

        queue.on('drain', () => {
          this.reporter.finished(this.test, error)
          resolve()
        })
      })
    },
  }
}

export default makeTest
