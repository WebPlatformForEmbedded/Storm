import contra from 'contra'
import Step from './step'

export default (test, reporter, device) => {
  return {
    exec() {
      reporter.init(test)

      return new Promise((resolve, reject) => {
        // run setup function if it exists
        if (test.setup && typeof test.setup === 'function') {
          test.setup()
        }
        contra.each.series(
          test.steps,
          (step, key, next) => {
            reporter.step(test, step)

            // make device info available in the step as this.device
            step.device = device

            try {
              Step(step, reporter)
                .exec()
                .then(() => {
                  reporter.pass(test, step)
                  next()
                })
                .catch(err => {
                  reporter.fail(test, step, err)
                  next(err)
                })
            } catch (e) {
              next(e)
            }
          },
          err => {
            if (err) {
              reporter.error(test, err)
              reject(err)
            } else {
              reporter.success(test)
              resolve()
            }
            // run teardown if it exists
            if (test.teardown && typeof test.teardown === 'function') {
              test.teardown()
            }
          }
        )
      })
    },
  }
}
