export default {
  title: 'Dummy - Failing tests - 7',
  description: 'Throw an error in the test function',
  steps: [
    {
      description: 'A synchronous test with assert that passes',
      test: x => x,
      params: 1,
      assert: 1,
    },
    {
      description: 'The same synchronous test with assert that fails',
      test: () => {
        throw new Error('this is a error in the test function')
      },
      params: 2,
    },
  ],
}
