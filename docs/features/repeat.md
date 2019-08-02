# Storm Test Runner

## Test Case Features - Repeating

Sometimes you will find yourself in a situation where you want to execute a certain Test step more than once. Instead of duplicating steps, you can make use of the `repeat` property to instruct the Test runner that a test step should be repeated.

The repeat property can be implemented in different ways, depending on how complex your needs are.

The most simple way is to set `repeat` to the *number* of times the test step should be repeated (i.e. `repeat: 2`).

Note that the *default value* for `repeat` is **0**, which means the test step will be executed **once**. Consequently, if you specify the `repeat` property as `1`, it means the step will be executed **twice**.

```js
  // ...
  steps: [
    {
      description: 'Test step that should be repeated twice',
      test() {
        // This test will run 3 times (once, plus 2 repetitions)
      },
      repeat: 2,
      assert: true,
    },
  ]
```

### Repeating Test cases

The repeat property can also be used at the level of a Test case, which instructs the Test Runner to repeat the entire test case a number of times in sequence.

```js
{
  title: 'Repeating test case',
  description: 'The entire testcase will run 5 times (once, plus 4 repetitions)',
  repeat: 4,
  steps: [
    // ...
  ]
}
```

### Advanced repetition configuration

When you repeat a test case and you specified a setup or teardown method, by default it will run them only **once**. Setup will run before running any step. And teardown will run after fininshing the _last_ Step in the _last_ Test case repetition.

However in some cases it is desirable to run the setup and teardown upon each Test run. For example, you might want to bring the STB back to an initial state with every repetition.

By specifying the repeat propery as an `object` you get more control over how the Test Runner handles repetitions.

The example below shows how you can instruct Storm Test Runner that setup and / or teardown should run for every repetition. Note that the `times` key is now used to indicate the number of repetitions.

```js
{
  // ...
  repeat: {
    times: 4,
    setup: true, // defaults to false
    teardown: true // defaults to false
  },
  steps: [
    // ...
  ]
}
```

Besides specifying the number of `times` a Test case or Test step should be repeated, it's also possible to repeat for a number of `seconds` or repeat `until` a certain condition is met.

The `until` key requires a function to be passed. This function will be executed upon each repetition. As long as the *until function* returns `false`, the repetition will continue. As soon as it returns `true` (which means the condition has been satisfied) the test runner moves on to the next step.

The `times` and `seconds` key can be specified as a `float` number (i.e. 2 times or 5,5 seconds), but you can also pass it a `function` that calculates and returns this float number. This could be useful in cases where you want to repeat a random number of times or if you would want to calculate the number of seconds to repeat.

See some examples of different object based `repeat` properties:

```js
{
  //...
  steps: [
    {
      description: 'Repeat 2 times',
      repeat: {
        times: 2
      },
      // ...
    },
    {
      description: 'Repeat random nr of times',
      repeat: {
        times() {
          return Math.floor(Math.random() * 10)
        }
      },
      // ...
    },
    {
      description: 'Repeat for 5,5 seconds (note: with built-in pauze of 500ms)',
      repeat: {
        seconds: 5.5
      },
      // ...
    },
    {
      description: 'Repeat untill a condition is met',
      repeat: {
        until() {
          // return false to continue repeating
          // return true to move to the next step
        }
      },
      // ...
    }
  ]
}
```

All options for the `repeat` are available on the _Test case_ level as well as the _Test step_ level. And you can use different repeat instructions accross your test case / test steps at the same time.
