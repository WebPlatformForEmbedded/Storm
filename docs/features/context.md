# Storm Test Runner

## Test Case Features - Context

Often your test cases depend on some context, i.e. certain variables and values that determine crucial parts of your tests.

While you are free to declare your own variables in a Test case's JS file, the test runner offers the possibility to define _contextual data_ inline in the test case, using the `context` property.

The context property accepts an object, but it does not care about the structure of this object. It can contain any value, including (deep) nested objects.

The specified context can be accessed via the convinience method `this.$context.read`, which accepts the property key as it's only argument. For (deep) nested objects you can use so called *dot-notation* to retrieve it's values.

```js
{
  title: 'Test case with context',
  description: 'This test case uses the context property',
  context: {
    version: '1.0.1',
    plugins: ['webkit', 'youtube'],
    system: {
      settings: {
        language: 'en',
      }
    }
  },
  steps: [
    {
      description: 'Retrieve the version from context',
      test() {
        return this.$context.read('version')
      },
      //
    },
    {
      description: 'Retrieve the language from context (deep nested)',
      test() {
        return this.$context.read('system.settings.language')
      },
      //
    }
  ]
}
```

The context convenience object is exposed as `this.$context` in pretty anywhere in a Test case: you can use it in `setup()` and `teardown()`, in a Tests step's `test()` and `validate()` function, but also in the `repeat()` and `sleep()` functions.

Context is defined once per Test case and is *read only* as the `$context` object only exposes a `read()` method.

