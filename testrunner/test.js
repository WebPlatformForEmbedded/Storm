import contra from 'contra'
import Step from './step'
import executeAsPromise from './lib/executeAsPromise'

export default (test, reporter, device) => {
  return {
    exec() {
      reporter.init(test)

      return new Promise((resolve, reject) => {
        // note to self: this is becoming a bit difficult to understand
        // at a glance, should refactor / restructure!
        executeAsPromise(test.setup).then(() => {
          contra.each.series(
            test.steps,
            (step, next) => {
              reporter.step(test, step)

              // make device info available in the step as this.device
              step.device = device

              // repeat steps (defaults to only once)
              contra.each.series(
                Array(step.repeat || 1).fill(step),
                (repeatStep, index, repeat) => {
                  try {
                    return Step(repeatStep, reporter)
                      .exec()
                      .then(() => {
                        reporter.pass(test, step)
                        repeat()
                      })
                      .catch(err => {
                        reporter.fail(test, step, err)
                        repeat(err)
                      })
                  } catch (e) {
                    next(e)
                  }
                },
                err => {
                  next(err)
                }
              )
            },
            err => {
              // first report the result
              err ? reporter.error(test, err) : reporter.success(test)
              // then execute the teardown
              executeAsPromise(test.teardown).then(() => {
                // and finally resolve or reject
                err ? reject(err) : resolve()
              })
            }
          )
        })
      })
    },
  }
}
