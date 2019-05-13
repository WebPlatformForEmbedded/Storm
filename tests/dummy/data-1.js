export default {
  id: 1,
  title: 'Dummy - Data - 1',
  description: 'Testing that data can be stored inside a test, which can be read in a test step',
  steps: [
    {
      description: 'Storing and reading some simple data',
      test() {
        this.$data.store('foo', 'I am foo!')
        return this.$data.read('foo')
      },
      assert: 'I am foo!',
    },
    {
      description: 'Storing and reading some nested data',
      test() {
        this.$data.store('bar.baz.foo', 'I am nested foo!')
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
        this.$data.store('zero', 0)
        this.$data.store('false', false)
        this.$data.store('empty_string', '')
        this.$data.store('null', null)
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
