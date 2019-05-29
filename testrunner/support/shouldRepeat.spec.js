import test from 'tape'
import shouldRepeat from './shouldRepeat'

test('shouldRepeat - Type', assert => {
  const expected = 'function'
  const actual = typeof shouldRepeat

  assert.equal(actual, expected, 'shouldRepeat should be a function')

  assert.end()
})

// signature context, repeat, index, start

test('shouldRepeat - repeat value as an integer', assert => {
  let repeat = 2
  let results = []
  // try 5 times, increasing the index as the test runner would do
  for (let i = 0; i < 5; i++) {
    results.push(shouldRepeat({}, repeat, i))
  }

  let expected = 2
  let actual = results.filter(item => item === true).length
  assert.equal(actual, expected, 'shouldRepeat should return `true` 2 times')

  assert.end()
})

test('shouldRepeat - repeat value as an object with `times`', assert => {
  let repeat = {
    times: 3,
  }
  let results = []
  // try 5 times, increasing the index as the test runner would do
  for (let i = 0; i < 5; i++) {
    results.push(shouldRepeat({}, repeat, i))
  }

  let expected = 3
  let actual = results.filter(item => item === true).length
  assert.equal(actual, expected, 'shouldRepeat should return `true` 3 times')

  assert.end()
})

test('shouldRepeat - repeat value as an object with `seconds`', assert => {
  let repeat = {
    seconds: 5,
  }
  let results = []

  let i = 0
  let start = new Date()
  let end = false
  // repeat every 500ms
  let interval = setInterval(() => {
    const result = shouldRepeat({}, repeat, i, start)
    // set ending time first time when shouldRepeat is false
    if (result === false && end === false) {
      end = new Date()
    }
    results.push(result)
    i++
  }, 500)

  // and try for 10 seconds
  setTimeout(() => {
    clearInterval(interval)

    let expected = 9
    let actual = results.filter(item => item === true).length
    assert.equal(
      actual,
      expected,
      'shouldRepeat should return `true` 9 times (every 500ms for 5 seconds)'
    )

    let min = 5
    let max = 6
    actual = (end - start) / 1000

    assert.ok(
      actual >= min && actual < max,
      'should take between 5 and 6 seconds to finish (actual: ' + actual + ')'
    )

    assert.end()
  }, 10 * 1000)
})

test('shouldRepeat - repeat value as an object with `until` function', assert => {
  let context = {
    counter: 0,
  }
  let repeat = {
    until() {
      return this.counter >= 10
    },
  }
  let results = []

  let i = 0

  // repeat every 500ms
  let interval = setInterval(() => {
    results.push(shouldRepeat(context, repeat, i))
    i++
    context.counter = i
  }, 500)

  // and try for 10 seconds
  setTimeout(() => {
    clearInterval(interval)

    let expected = 10
    let actual = results.filter(item => item === true).length
    assert.equal(actual, expected, 'shouldRepeat should return `true` 10 times')

    assert.end()
  }, 10 * 1000)
})
