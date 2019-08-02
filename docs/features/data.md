# Storm Test Runner

## Test Case Features - Data

Sometimes it can be useful to keep track of data inside a Test case. We can define data in [Context](./context.md), but context is defined only once and is read only.

Since a test case is 'just javascript' you could just store data inside variables declared in the Test case's JS file. However, for convenience the Test runner offers a built-in way to store, write and retrieve data.

Similar `$context` there is a `$data` object, that is exposed as `this.$data` in pretty much any function inside a Test case (`setup()`, `teardown()`, `test()`, `validate()`, `sleep()` etc.).

The `$data` object has 2 methods: `read()` which accepts a `key` as it's only argument and `write()` which accepts a  `key` and `value` to assign to this property as it's arguments.

To store and retrieve (deep) nested data *dot-notation* can be used.

Stored data will remain available (in memory, there is no persistance) during the entire run of the Test case. This means that data written in one Test _step_ can be read on a next _step_.


```js
{
  title: 'Test case with data',
  description: 'This test writes and read data',
  setup() {
    // initialize data in setup function
    this.$data.write('step_count', 0)
  },
  steps: [
    {
      description: 'Read and write data',
      test() {
        // read data
        const step_count = this.$data.read('step_count')
        // write data
        this.$data.write('step_count', step_count + 1)
        this.$data.write('deep.nested.key', 'foobar')
      },
    },
    {
      description: 'Read data from previous step',
      test() {
        // read data stored in previous step
        return this.$data.read('deep.nested.key')
      },
      // assert
      assert: 'foobar',
    },
  ]
}
```
