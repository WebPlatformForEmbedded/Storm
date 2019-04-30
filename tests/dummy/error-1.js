export default {
  title: 'Dummy - Tests with errors - 1',
  description: 'Testing a test function with an Error',
  steps: [
    {
      description: 'A test without an error in the test execution',
      test: x => x,
      params: 1,
      assert: 1,
    },
    {
      description: 'A test with an error in the test execution',
      // eslint-disable-next-line
      test: x => foo(), // foo is undefined and should throw an error
      params: 1,
      assert: 1,
    },
  ],
}
