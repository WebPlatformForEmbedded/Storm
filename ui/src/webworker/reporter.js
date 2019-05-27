import sanitizer from './sanitizer'

export default worker => {
  return {
    init(test) {
      worker.postMessage({
        type: 'init',
        payload: {
          message: 'Initiating test - ' + test.title,
          test: sanitizer(test),
        },
      })
    },
    step(test, step) {
      worker.postMessage({
        type: 'step',
        payload: {
          message: step.description,
          test: sanitizer(test),
          step: sanitizer(step),
        },
      })
    },
    log(message) {
      worker.postMessage({
        type: 'message',
        payload: {
          message: message,
        },
      })
    },
    sleep(milliseconds) {
      worker.postMessage({
        type: 'sleep',
        payload: {
          seconds: milliseconds / 1000,
        },
      })
    },
    pass(test, step) {
      worker.postMessage({
        type: 'pass',
        payload: {
          message: 'Step `' + step.description + '` passed',
          test: sanitizer(test),
          step: sanitizer(step),
        },
      })
    },
    fail(test, step, error) {
      worker.postMessage({
        type: 'fail',
        payload: {
          message: 'Step  `' + step.description,
          test: sanitizer(test),
          step: sanitizer(step),
          error: sanitizer(error),
        },
      })
    },
    success(test) {
      worker.postMessage({
        type: 'success',
        payload: {
          message: 'Success',
          test: sanitizer(test),
        },
      })
    },
    error(test, error) {
      worker.postMessage({
        type: 'error',
        payload: {
          message: 'Error',
          test: sanitizer(test),
          error: sanitizer(error),
        },
      })
    },
    finished(test, error) {
      worker.postMessage({
        type: 'finished',
        payload: {
          message: 'Finished',
          test: sanitizer(test),
          error: sanitizer(error),
        },
      })
    },
  }
}
