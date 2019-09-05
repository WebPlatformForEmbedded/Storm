export default {
  title: 'Dummy - Data - 1',
  description: 'Testing that data can be stored inside a test, which can be read in a test step',
  steps: [
    {
      description: 'Storing and reading some simple data',
      test() {
        this.$data.write('foo', 'I am foo!')
        return this.$data.read('foo')
      },
      assert: 'I am foo!',
    },
    {
      description: 'Storing and reading some nested data',
      test() {
        this.$data.write('bar.baz.foo', 'I am nested foo!')
        return this.$data.read('bar.baz.foo')
      },
      assert: 'I am nested foo!',
    },
    {
      description: 'Reading data that was set in a different step',
      test() {
        return this.$data.read('foo') + ' ' + this.$data.read('bar.baz.foo')
      },
      assert: 'I am foo! I am nested foo!',
    },
    {
      description: 'Setting and reading falsy data',
      test() {
        this.$data.write('zero', 0)
        this.$data.write('false', false)
        this.$data.write('empty_string', '')
        this.$data.write('null', null)
        return true
      },
      validate() {
        return (
          this.$data.read('zero') === 0 &&
          this.$data.read('false') === false &&
          this.$data.read('empty_string') === '' &&
          this.$data.read('null') === null
        )
      },
    },
  ],
}
