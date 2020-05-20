export default {
  title: 'Dummy - Context - 1',
  description:
    'Testing that a test can have a context of variables that can be accessed in test steps via a `this.$context.read` method',
  context: {
    foo: 'I am foo!',
    bar: ['🍕', '🍔', '🍦', '🍺'],
    foobar: {
      foo: {
        bar: 'I am nested',
      },
    },
  },
  steps: [
    {
      description: 'Printing a string from context',
      test() {
        return this.$context.read('foo')
      },
      assert: 'I am foo!',
    },
    {
      description:
        'Getting a random item from an array from context (and accessing context in validate method)',
      test() {
        const items = this.$context.read('bar')

        return items[Math.floor(Math.random() * items.length)]
      },
      validate(result) {
        return this.$context.read('bar').indexOf(result) > -1
      },
    },
    {
      description: 'Getting a nested context value using convenient dot-notation',
      test() {
        return this.$context.read('foobar.foo.bar')
      },
      assert: 'I am nested',
    },
  ],
}
