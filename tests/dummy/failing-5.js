export default {
  title: 'Dummy - Failing tests - 5',
  description: 'Testing that the test stops after a failing step ',
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
      assert: 1,
    },
    {
      description: 'A test after a failing test should never be executed)',
      test: x => x,
      params: 1,
      assert: 1,
    },
  ],
}
