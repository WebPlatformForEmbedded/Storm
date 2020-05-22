export default {
  title: 'Dummy - Failing tests - 6',
  description: 'Throw an error in validate',
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
        throw new Error('This is a thrown error')
      },
    },
  ],
}
