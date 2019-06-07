export default {
  title: 'Dummy - Validation helpers - 1',
  description: 'Using Expect validation helper for passing tests',
  steps: [
    {
      description: 'A simple test that should be true',
      test: x => x,
      params: true,
      validate(result) {
        return this.$expect(result).toBe(true)
      },
    },
    {
      description: 'Testing that 10 is greater than 1',
      test: x => x,
      params: 10,
      validate(result) {
        return this.$expect(result).toBeGreaterThan(1)
      },
    },
    {
      description: 'Validating that an array contains a specific value',
      test() {
        return ['Cat', 'Dog', 'Rabbit', 'Horse']
      },
      validate(result) {
        return this.$expect(result).toContain('Cat')
      },
    },
    {
      description: 'Validating that we can do negative expectations with .not',
      test() {
        return ['Cat', 'Dog', 'Rabbit', 'Horse']
      },
      validate(result) {
        return this.$expect(result).not.toContain('Chicken')
      },
    },
  ],
  validate() {
    return this.$expect('hello').toHaveLength(5)
  },
}
