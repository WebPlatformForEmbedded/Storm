export default {
  id: 1,
  title: 'Dummy - Repeat - 1',
  description: 'Testing if we can repeat a test step 2 times',
  steps: [
    {
      description: 'Test that should run twice',
      test: x => x,
      params: 1,
      assert: 1,
      repeat: 2,
    },
    {
      description: 'Test that should run only once',
      test: x => x,
      params: 1,
      assert: 1,
    },
    {
      description: 'Test with asynchronous function (3 second timeout) that should run twice',
      test: () => {
        return new Promise(resolve =>
          setTimeout(() => {
            resolve(1)
          }, 3000)
        )
      },
      params: 1,
      assert: 1,
      repeat: 2,
    },
    {
      description: 'Test that is intended to run twice, but fails and should run only once',
      test: x => x,
      params: 1,
      assert: 2,
      repeat: 2,
    },
  ],
}
