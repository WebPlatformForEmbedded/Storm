export default {
  title: 'Dummy - Validation helpers - 2',
  description: 'Using Expect validation helper for failing tests',
  steps: [
    {
      description: 'A simple test that fails the validation',
      test: x => x,
      params: true,
      validate(result) {
        return this.$expect(result).to.be(false)
      },
    },
  ],
}
