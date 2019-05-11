export default {
  id: 1,
  title: 'Dummy - Data - 1',
  description: 'Testing that data can be stored inside a test, which can be read in a test step',
  steps: [
    {
      description: 'Storing and reading some simple data',
      test() {
        this.store('foo', 'I am foo!')
        return this.read('foo')
      },
      assert: 'I am foo!',
    },
    {
      description: 'Storing and reading some nested data',
      test() {
        this.store('bar.baz.foo', 'I am nested foo!')
        return this.read('bar.baz.foo')
      },
      assert: 'I am nested foo!',
    },
    {
      description: 'Reading data that was set in a different step',
      test() {
        return this.read('foo') + ' ' + this.read('bar.baz.foo')
      },
      assert: 'I am foo! I am nested foo!',
    },
  ],
}
