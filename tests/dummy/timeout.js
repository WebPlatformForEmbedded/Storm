const timeout = function(wait) {
  return new Promise((resolve, reject) => {
    const action = setTimeout(() => {
      cleanup()
      resolve(wait)
    }, wait * 1000)

    const timer = setTimeout(() => {
      cleanup()
      reject('Max execution time exceeded')
    }, this.timeout * 1000)

    const cleanup = () => {
      clearTimeout(timer)
      clearTimeout(action)
    }
  })
}

export default {
  title: 'Dummy - Timeout',
  description: 'Testing steps with a timeout (custom method)',
  steps: [
    {
      description: 'A test with a timeout that finishes on time',
      timeout: 10,
      test: timeout,
      params: 5,
      assert: 5,
    },
    {
      description: 'A test with a timeout that exceeds the maximum execution time',
      timeout: 5,
      test: timeout,
      params: 10,
      assert: 10,
    },
  ],
}
