import Contra from 'contra'
import Moment from 'moment'
import Axios from 'axios'

import Step from './step'

import {
  shouldRepeat,
  shouldRunSetup,
  runSetup,
  runTeardown,
  runValidate,
  calculateSleep,
  calculateRepeat,
  dotObjectKey,
  expect,
} from './support'

import thunderRemoteControl from './support/thunder/remoteControl'
import sequence from './support/sequence'
import {
  getChoiceAsInputFromRawList,
  getChoiceAsInputFromUser,
  getConfirmationFromUser,
  getPasswordAsInputFromUser,
  getTextAsInputFromUser,
} from './support/prompt'

const runTest = function(index) {
  return new Promise((resolve, reject) => {
    this.reporter.init(this.test)

    calculateSleep((index === 0 && this.test.sleepOnce) || this.test.sleep, this.test)
      .then(sleep => {
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
                        .then(res => {
                          next()
                        })
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
                  if (!this.test.validate) {
                    return next()
                  }

                  runValidate(this.test, this.test.validate)
                    .then(res => {
                      next(null, res)
                    })
                    .catch(e => {
                      console.log('catch', e)
                      next(e)
                    })
                },
              ],
              // 5) done
              (err, results) => {
                const done = () => {
                  if (err) {
                    this.reporter.error(this.test, err)
                    reject(err)
                  } else {
                    this.reporter.success(this.test)
                    resolve()
                  }
                }

                // always run test teardown
                !!this.test.teardown
                  ? runTeardown(this, this.test.teardown)
                      .then(res => {
                        done(res)
                      })
                      .catch(e => {
                        done()
                      })
                  : done()
              }
            )
          },
          // unless sleep is specified, sleep for 500ms between repeating a test (but not on the first run!)
          sleep ? sleep : Math.min(1, index) * 500
        )
      })
      .catch(reject)
  })
}

const runSteps = function(steps) {
  return new Promise((resolve, reject) => {
    Contra.each.series(
      steps,
      (step, next) => {
        // sub test
        if (step.steps) {
          step = {
            ...step,
            ...{ context: { ...this.test.context, ...step.context }, data: this.test.data },
          }
          makeTest(step, this.reporter, this.thunderJS)
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
    $thunder: {
      api: this.thunderJS,
      remoteControl: thunderRemoteControl.apply(this, [this.thunderJS]),
    },
    $log: this.reporter.log,
    $context: {
      read: function(key) {
        return dotObjectKey.get(this.context, key)
      }.bind(this),
    },
    $prompt: {
      // getConfirmationFromUser,
      choice: function(msg, choice) {
        return getChoiceAsInputFromUser(msg, choice)
      },
      text: function(msg) {
        return getTextAsInputFromUser(msg)
      },
      rawlist: function(message, choice) {
        return getChoiceAsInputFromRawList(message, choice)
      },
      password: function(message) {
        return getPasswordAsInputFromUser(message)
      },
      confirm: function() {
        return getConfirmationFromUser()
      },
    },
    $data: {
      read: function(key) {
        return dotObjectKey.get(this.data, key)
      }.bind(this),
      write: function(key, value) {
        dotObjectKey.assign(this.data, key, value)
      }.bind(this),
    },
    $http: Axios,
    $moment: Moment,
    $expect: expect,
    $sequence: sequence,
  }
}

const makeTest = (testCase, reporter, thunderJS) => {
  const defaults = {
    data: {},
    context: {},
  }

  const test = Object.assign(
    // Mixin functionality into the test case
    Object.create(Mixin.call({ ...defaults, ...testCase, ...{ reporter, thunderJS } })),
    { ...defaults, ...testCase }
  )

  // calculate repeat
  test.repeat = calculateRepeat(testCase.repeat, test)

  return {
    reporter,
    thunderJS,
    test,
    exec() {
      // execue the test (multiple times depending on repeat)
      return new Promise((resolve, reject) => {
        let index = 0
        let start = new Date()
        let error = null

        thunderJS.on('connect', () => {
          this.reporter.log('Connected to Thunder JSON-RPC interface')
        })

        thunderJS.on('error', () => {
          this.reporter.error('Error from JSON-RPC interface')
        })

        thunderJS.on('disconnect', () => {
          this.reporter.log('Disconnected from Thunder JSON-RPC interface')
        })

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
