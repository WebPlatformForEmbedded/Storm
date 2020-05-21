export default {
  title: 'Dummy - Sleep - 4',
  description:
    'Testing that when a sleep function returns a promise, the test will only start after the promise resolves',
  sleep: () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 2000)
    })
  },
  steps: [
    {
      description:
        'Step with a sleep function that returns a promise should only run after the promise resolves',
      sleep: () => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve()
          }, 5000)
        })
      },
      test: x => x,
      params: 1,
      assert: 1,
    },
    {
      description:
        'Step with a sleep function that returns a promise that resolves a sleep value should only run after the promise resolves (and consider the sleep value)',
      sleep: () => {
        return new Promise(resolve => {
          setTimeout(() => {
            // return a sleep value of 2
            resolve(2)
          }, 1000)
        })
      },
      test: x => x,
      params: 1,
      assert: 1,
    },
  ],
}
