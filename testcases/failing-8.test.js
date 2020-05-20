export default {
  title: 'Dummy - Failing tests - 8',
  description: 'Return undefined on validate',
  steps: [
    {
      description: 'A synchronous test with assert that passes',
      test: x => x,
      params: 1,
      assert: 1,
    },
    {
      description: 'The same synchronous test with assert that fails',
      test: x => x,
      params: 2,
      validate: () => {
        return
      },
    },
  ],
}
