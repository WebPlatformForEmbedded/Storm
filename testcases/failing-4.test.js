export default {
  title: 'Dummy - Failing tests - 4',
  description: 'Testing a failing test step (asynchronous / custom validate)',
  steps: [
    {
      description: 'An asynchronous test with a custom validate function that passes',
      test: async x => x,
      params: 1,
      validate: x => x === x,
    },
    {
      description: 'An asynchronous test with a custom validate function that fails',
      test: async x => x,
      params: 1,
      validate: x => x > x,
    },
  ],
}
