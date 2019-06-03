import Contra from 'contra'
import { shouldRepeat, runValidate, calculateSleep, calculateRepeat } from './support'
import executeAsPromise from './lib/executeAsPromise'

const runStep = function(index) {
  return new Promise((resolve, reject) => {
    const sleep = calculateSleep(this.step.sleep)

    if (sleep) {
      this.reporter.sleep(sleep)
    }

    this.step.repeat = calculateRepeat(this.step.repeat)

    setTimeout(() => {
      this.reporter.log(
        (index > 0 ? 'Repeating (' + index + ') ' : 'Executing ') + this.step.description
      )

      Contra.waterfall(
        [
          // execute test function
          next => {
            // this could be abstracted in a prettier way?
            executeAsPromise(
              this.step.test,
              this.step.params instanceof Array ? this.step.params : [this.step.params],
              this.step
            )
              .then(result => {
                next(null, result)
              })
              .catch(err => next(err))
          },
          // validate the result
          (result, next) => {
            if (!this.step.validate && this.step.assert) {
              this.step.validate = x => x === this.step.assert
            }
            runValidate(this.test, this.step.validate, result)
              .then(next)
              .catch(e => {
                next(e)
              })
          },
        ],
        // done!
        (err, results) => {
          if (err) {
            this.reporter.fail(this.test, this.step, err)
            reject(err)
          } else {
            this.reporter.pass(this.test, this.step)
            resolve()
          }
        }
      )
    }, sleep || 500)
  })
}

export default (test, step, reporter) => {
  return {
    reporter,
    test,
    step: Object.assign(
      // Mix test functionality into the step
      Object.create(test.__proto__),
      step
    ),
    exec() {
      // execute the step (multiple times depending on repeat)
      return new Promise((resolve, reject) => {
        let index = 0
        let start = new Date()
        // let error = null

        const queue = Contra.queue((job, done) => {
          runStep
            .call(job, index)
            .then(() => {
              done()
              if (shouldRepeat(job.test, job.step.repeat, index, start)) {
                queue.push(job, () => {
                  index++
                })
              }
            })
            .catch(err => {
              // error = err
              reject(err)
              done()
            })
        })

        queue.push(this, () => {
          index++
        })

        queue.on('drain', () => {
          resolve()
        })
      })
    },
  }
}
