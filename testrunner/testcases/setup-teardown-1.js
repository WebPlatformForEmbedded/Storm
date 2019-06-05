export default {
  title: 'Dummy - Setup / Teardown - 1',
  description:
    'Testing a test with a synchronous Setup and a synchronous Teardown method (see console.log)',
  setup() {
    this.$log('I am a synchronous Setup method. I should run before the steps')
  },
  teardown() {
    this.$log('I am a synchronous Teardown method. I should run after the steps')
  },
  steps: [
    {
      description: 'A synchronous test with assert',
      test: x => x,
      params: 1,
      assert: 1,
    },
  ],
}
