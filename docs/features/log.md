# Storm Test Runner

## Test Case Features - Log

Since Test cases are normal javascript, it can be tempting to use `console.logs` throughout the test cases, especially during development.

It's not recommended to do this, though. Instead use the **log helper** that is exposed by the Test Runner as `this.$log`. This makes sure that the log messages are properly printed in the Test runner results.

As with *data* and *context*, the `$log` convenience method is available in any function inside a test case.

```js
{
  title: 'Using the logger',
  description: 'Log useful information and print it in the Test runner results',
  sleep() {
    const randomSleep = Math.floor(Math.random() * 10) + 1
    this.$log('Sleeping for ' + randomSleep + ' seconds')
    return randomSleep
  },
  steps: [
    {
      description: 'Logging the result of a request',
      test() {
        return new Promise((resolve, reject) => {
          // make a request to the STB (example code!)
          request('/systeminfo')
            .then(result => {
              this.$log('Version ' + result)
              resolve(result)
            }).catch(err => {
              reject(err)
            })
        })
      },
      assert: 'v1.0.1',
    },
  ]
}
```
