export default {
  title: 'Dummy - Test validate - 1',
  description:
    'Testing that a test can have an optional final validation at the end of running all the test steps',
  setup() {},
  steps: [
    {
      description: 'Just a simple test step',
      test(param) {
        return param
      },
      params: 1,
      assert: 1,
    },
    {
      description: 'Another simple test step',
      test(param) {
        return param
      },
      params: 1,
      assert: 1,
    },
    {
      description: 'And the last simple test step',
      test(param) {
        return param
      },
      params: 1,
      assert: 1,
    },
  ],
  validate() {
    this.$log('Running final test validation')
    return 1 > 0
  },
}
