# Storm Test Runner

## Test cases and Test steps

Storm uses a custom format for defining Test cases. Test cases are plain JS *object literals* that contain instructions for the Storm Test Runner.

Each _Test case_ consists of a number of _Test steps_. Each step performs a certain _action_, and for each step a specific _result_ is expected. Test steps are executed in sequence. And as long as every test step passes, the test runner will move on to the next step.

If all Test steps pass (i.e. the result of each step is according to expectations) the test case is considered successful.

Storm Test Runner is capable of running _multiple tests_ in sequence. Unless the code in a Test case itself produces a fatal error, the test runner will move on to the next Test case independent of the result (success or failure).

### Basic structure of a Test case

Let's start with the most basic format of a test case.

At the bare minimum every test case has at least a **title**, a **description** and an `Array` of **steps** (optionally this can be an `Object` as well (see [advanced use cases](###Advanced))).

```js
{
  // each test case has a unique (!) title
  title: 'Short title to indicate what the test case is about',
  // each test case also has a description
  description: 'Longer description to explain more details',
  // an array of test steps
  steps: [
  ],
}
```

### Test steps

Each test step is an _object_ with a set of instructions for the Test Runner. It gives the Test Runner a function to execute, and informs what to expect as a result.

A test step at the very least has:
- a **description** that explains what the step does
- a **test function** to be executed
- an **assert value** or a **validate function** to evaluate the _expected results_ of the test function

Optionally you can specify a **parameter** or an `array` of **parameters** that will be passed as arguments to the test function.

A test function should *always* return a value. This returned value is compared with the value set in the assert property (be aware that assert uses **Strict Equality Comparison**).

In the case of a validate function, the return value is passed as an argument to this function. A validate function should return `true` (when the result is as expected) and `false` (when it doesn't match expectations).

Some examples to illustrate the different options:

```js
{
  title: 'Basic',
  description: 'Basic Test Case',
  steps: [{
    description: 'Simple test and assert',
    // test function to be executed, always returns a value
    test() {
      // do something useful here ..
      return true
    },
    // assert that the test function returns true
    assert: true,
  },
  {
    description: 'Use a single parameter',
    test(x) {
      return x * 2
    },
    params: 1,
    // assert that the test function returns 1 * 2
    assert: 2,
  },
  {
    description: 'Pass multiple parameters to the test function',
    test(x, y) {
      return x * y
    },
    // multiple params as an array
    params: [2, 3],
    // assert that the test function returns (2 * 3)
    assert: 6,
  },
  {
    description: 'Validate with a custom validate function',
    test() {
      return 'storm test runner',
    },
    // validate receives the result from the test-function as it's first argument and returns true or false
    validate(result) {
      return result.length === 17
    }
  }],
}
```

### Asynchonous steps

The Test runner is built to work with both _synchronous_ and _asynchronous_ test steps. In the examples above all **test functions** returned their results right away. But often in real test scenarios, this is not the case.

For example when fetching results from a Set Top Box (STB) there will be some delay. In these cases the test function should return a `Promise` instead. When a promise is returned by the test function, the *assert* or *validate function* will only be invoked after the Promise is `resolved` (or `rejected` in case of an error, off course).

```js
{
  // ...
  steps: [
    {
      description: 'Asynchonous test step returning a Promise',
      test() {
        return new Promise((resolve, reject) => {
          // make a request to the STB (note: this is example code!)
          request('/deviceinfo/version')
            .then(result => {
              resolve(result)
            }).catch(err => {
              reject(err)
            })
        })
      },
      assert: 'v1.0.1',
    }
  ]
}
```

### Failing and passing steps

It's important to remember that the Test Runner expects every step to pass. As long as a step passes the runner will move to the next step, until it reaches the end. Whenever a step fails, the Test Runner will stop the execution (of that Test case) immediately and the entire Test Case will be marked as failed.

This means that test steps after a failing steps will *not* be executed. When running multiple Test cases however, the Test runner _will_ move on to the next Test cases, even when a Test case is marked as not successful.


### Test Case Features

So far we've only looked at some basic Test cases, but Storm Test Runner has several features that allow for complex Test cases.

- [Sleeping](./features/sleeping.md)
- [Setup and Teardown](./features/setup-teardown.md)
- [Repeating](./features/repeat.md)
- [Context](./features/context.md)
- [Data](./features/data.md)
- [Log](./features/log.md)
- [Test Case Validation](./features/test-case-validation.md)
- [Nested Test Cases](./features/nested.md)
- [Executing http calls](./features/http-calls.md)
- [Assertion helper](./features/assertion-helper)
- [ThunderJS helper](./features/thunderjs-helper)

### Advanced

Todo
