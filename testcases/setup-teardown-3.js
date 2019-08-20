export default {
  title: 'Dummy - Setup / Teardown - 3',
  description:
    'Testing a test with a Setup and a Teardown that are not functions (and should not be executed)',
  setup: 'I am not a function, and I cannot be executed',
  teardown: 'I am not a function, and I cannot be executed',
  steps: [
    {
      description: 'A synchronous test with assert',
      test: x => x,
      params: 1,
      assert: 1,
    },
  ],
}
