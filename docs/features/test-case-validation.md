# Storm Test Runner

## Test Case Features - Test case validation

By default a Test case is marked as successfull when all of it's Test steps pass. But sometimes you might want to perform a final check after successfully completing all steps.

In order to to such a final validation, you can add a `validation` function to a Test case (similar to how you would normally use a validation method in a Test step). When the `validate` property is defined in the root level of the Test case object, this validation function will be called last, but before the `teardown()` method.

As with Test step validation functions, this function should return either `true` or `false` depending on whether the expection is met.

Contrary to test steps validation methods, the final validation method *doesn't* receive a result as it's argument. Instead you will have to manually retrieve data (using the `this.$data` convience object for example) and evaluate this result.

```js
{
  title: 'Final test validation',
  description: 'Test that uses a final validation method for the entire test',
  setup() {
    this.$data.write('cpu_loads', [])
  },
  steps: [
    {
      description: 'Repeating test step to get CPU load of STB',
      repeat: 100,
      test() {
        const cpu_loads = this.$data.read('cpu_loads')

        // do a request retrieve CPU from STB (fake code!!)
        const cpu = request.getcpu()
        this.$data.store('cpu_loads', cpu_loads.push(cpu))
        return cpu
      },
      validate(cpu) {
        // fail if CPU is higher than 90
        return cpu <= 90
      }
    },
  ],
  validate() {
    // retrieve data set in previous steps
    const cpu_loads = this.$data.read('cpu_loads)
    // and do some kind of evaluation (average, max, median, etc.)
  }
}
```
