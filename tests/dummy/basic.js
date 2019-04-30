export default {
  id: 1,
  title: 'Dummy - Basic functionality',
  description:
    'Testing synchronous and asynchronous tests with assert and custom validation methods',
  steps: [
    {
      description: 'A synchronous test with assert',
      test: x => x,
      params: 1,
      assert: 1,
    },
    {
      description: 'A synchronous test with a custom validate function',
      test: x => x,
      params: 1,
      validate: x => x === x,
    },
    {
      description: 'An asynchronous test with assert',
      test: async x => x,
      params: 1,
      assert: 1,
    },
    {
      description: 'An asynchronous test with a custom validate function',
      test: async x => x,
      params: 1,
      validate: x => x === x,
    },
  ],
}
