export default {
  title: 'Dummy - Test validate - 2',
  description:
    'Testing that a test fails if final test validation fails (even if each separate step passed)',
  steps: [
    {
      description: 'Just a simple test step',
      test: x => x,
      params: 1,
      assert: 1,
    },
    {
      description: 'Another simple test step',
      test: x => x,
      params: 2,
      assert: 2,
    },
    {
      description: 'And the last simple test step',
      test: x => x,
      params: 3,
      assert: 3,
    },
  ],
  validate() {
    console.log('Running (failing) final test validation')
    return 1 < 0
  },
}
