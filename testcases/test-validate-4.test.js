export default {
  title: 'Dummy - Test validate - 4',
  description: 'Testing that a test can have an optional validate',
  setup() {},
  steps: [
    {
      description: 'Just a simple test step',
      test(param) {
        return param
      },
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
}
