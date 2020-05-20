export default {
  title: 'Dummy - Failing tests - 2',
  description: 'Testing a failing test step (synchronous / custom validate)',
  steps: [
    {
      description: 'A synchronous test with a custom validate function that passes',
      test: x => x,
      params: 1,
      validate: x => x === x,
    },
    {
      description: 'A synchronous test with a custom validate function that fails',
      test: x => x,
      params: 1,
      validate: x => x > x,
    },
  ],
}
