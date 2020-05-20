export default {
  title: 'Dummy - Setup / Teardown - 2',
  description: 'Testing a Teardown method (see console.log) after a test with a failing step',
  teardown() {
    this.$log('I am Teardown method. I should run after the (failing) step')
  },
  steps: [
    {
      description: 'A failing test with assert',
      test: x => x,
      params: 1,
      assert: 2,
    },
    {
      description: 'A passing test with assert (that will never be executed)',
      test: x => x,
      params: 1,
      assert: 1,
    },
  ],
}
