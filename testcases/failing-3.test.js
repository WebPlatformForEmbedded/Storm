export default {
  title: 'Dummy - Failing tests - 3',
  description: 'Testing a failing test step (asynchronous / assert)',
  steps: [
    {
      description: 'An asynchronous test with an assert that passes',
      test: async x => x,
      params: 1,
      assert: 1,
    },
    {
      description: 'An asynchronous test with an assert that fails',
      test: async x => x,
      params: 1,
      assert: 2,
    },
  ],
}
