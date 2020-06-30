export default {
  title: 'Dummy - Setup / Teardown - 5',
  description: 'Testing to see if the Teardown is called when the test fails',
  setup() {
    this.$log('I am a synchronous Setup method. I should run before the steps')
  },
  teardown() {
    this.$log('I am a synchronous Teardown method that fails and is ignored')
    throw new Error('This is a thrown error')
  },
  steps: [
    {
      description: 'The same synchronous test with assert that fails',
      test: x => x,
      params: 1,
      assert: 1,
    },
  ],
}
