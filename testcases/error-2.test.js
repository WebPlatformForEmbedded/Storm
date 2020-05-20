export default {
  title: 'Dummy - Tests with errors - 2',
  description: 'Testing a validation function with an Error',
  steps: [
    {
      description: 'A test without an error in the validation execution',
      test: x => x,
      params: 1,
      validate: x => x === x,
    },
    {
      description: 'A test with an error in the validation execution',
      test: x => x,
      params: 1,
      // eslint-disable-next-line
      validate: x => x === y, // y is undefined and should throw an error
    },
  ],
}
