export default {
  title: 'Dummy - Setup / Teardown - 4',
  description:
    'Testing a test with an asynchronous Setup and a asynchronous Teardown method (see console.log)',
  setup: () => {
    return new Promise(resolve =>
      setTimeout(() => {
        console.log(
          'I am an asynchronous Setup method. I should finish running before the steps start. I take 3 seconds to finish.'
        )
        resolve()
      }, 3000)
    )
  },
  teardown: () => {
    return new Promise(resolve =>
      setTimeout(() => {
        console.log(
          'I am an asynchronous Teardown method. I should run after the steps and I take 3 seconds to finish.'
        )
        resolve()
      }, 3000)
    )
  },
  steps: [
    {
      description: 'A test with assert',
      test: x => x,
      params: 1,
      assert: 1,
    },
  ],
}
