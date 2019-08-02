# Storm Test Runner

## Test Case Features - Setup and Teardown

Sometimes you need to execute a series of actions to get to the state of what you actually want to test. For example, if you want to test if the Youtube App can play a certain video, you first have to make sure the STB is connected to the internet, that the Youtube App is up and running and is navigated to the right screen etc.

### Using test steps to prepare your environment

A natural way to do this, is to make each of these preparative actions a separate *Test step* in the Test case. This way you can take advantage of the builtin sequentiality and pauzes between steps. Also you have the added advantage of being able to validate that each preparative action was executed successfully / as expected.

Just make sure to always return a value from each step's test function (can be just `true`), even if you're not really testing something.

```js
{
  // ...
  steps: [
    {
      description: 'Test if STB is connected to internet',
      test() {
        // test internet connectivity of STB
      },
      assert: true,
    },
    {
      description: 'Open Youtube App',
      test() {
        // fire command to open the Youtube App on the STB
      },
      assert: true,
    },
    {
      // wait 5 seconds to make sure Youtube App is up and running
      sleep: 5,
      description: 'Load video URL in Youtube App',
      test(url) {
        // fire command to load video URL
      },
      params: 'http://youtube.com/123123',
      assert: true,
    }
  ]
}
```

### Using a Setup function

Another option to prepare your environment for running the actual tests, is to add a `setup` function to a Test case. This setup function will be executed _before_ initiating the first step.

An advantage of using a setup function is that you can group stuff that isn't directly related to the actual test inside a single function and keep the number of steps to a minium. Using a setup function will result in cleaner and more reasabe Test cases.

```js
{
  title: 'Test case with a setup',
  description: 'The setup function will run before starting the test steps',
  setup() {
    // prepare the environment
  },
  steps: [
    //
  ]
}
```

If the preparations in the setup function are *synchonous*, there is no need for the setup function to return anything. However, if you want to execute *asynchonous* code in the setup (such as making a request to the STB), you should wrap the functionality in a `Promise` and return that. If you don't, the steps will start running before the setup has completed.

```js
{
  title: 'Test case with a asynchronous setup',
  description: 'This setup function takes a while to finish ...',
  setup() {
    return new Promise(resolve => {
      // do some asynch stuff here, like making a request to the STB
      resolve()
    })
  },
  steps: [
    //
  ]
}
```

Similar to a setup function there is a **teardown** function, which will run *after* completing all the steps. This could be used for example to shutdown apps and bring the STB back to a fresh state, before moving on to the next Test case.

```js
{
  title: 'Test case with a teardown function',
  description: 'The teardown will run after completing all steps',
  teardown() {
    // bring back the environment to a fresh state
  },
  steps: [
    //
  ]
}
```

As with the setup function, the teardown function should return a `Promise` when it's performing asynchronous code. This makes sure the Test runner will *not* move on to the next Test case until the the teardown is completed (by resolving the Promise).
