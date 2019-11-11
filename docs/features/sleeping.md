# Storm Test Runner

## Test Case Features - Sleeping

By default the Test Runner implements small pauzes of 500 milliseconds in between Test steps and Test cases. But sometimes a longer pauze is desired.

You can specify how long the Test Runner should *pauze* (or sleep) between Test steps or Test cases, by adding a `sleep` property with a value in **seconds**. You can use whole seconds, but also decimals. And optionally you can define sleep as a *function* that returns a (calculated) number of seconds.

```js
{
  title: 'Sleep .. zzzz',
  description: 'Implementing larger pauzes between steps and tests cases',
  // wait 5 seconds before starting this test case
  sleep: 5,
  steps: [
    {
      description: 'Wait 2.5 seconds before starting this test step'
      sleep: 2.5,
      test() {
        return true
      },
      assert: true
    },
    {
      description: 'Wait until the next minute to execute this step (calculated on the fly)',
      sleep: () => {
        const date = new Date()
        const secondsToNextMinute = 60 - date.getSeconds()
        return secondsToNextMinute
      },
      test() {
        return true
      },
      assert: true,
    },
    {
      description: 'Sleep a random amount of seconds between 1 and 10',
      sleep: () => {
        return Math.floor(Math.random() * 10) + 1
      },
      test() {
        return true
      },
      assert: true,
    }
  ]
}
```

### Sleep once

When you use the [Repeat](./repeat.md)-funtionality, it's important to realize that the waiting time is taken into account for _every_ repetition of the test or step. In case you want to pauze only on the first iteration, you can specify a `sleepOnce` value. The sleepOnce functionality is identical to the `sleep` functionality, with the exception that it only executed only once.
