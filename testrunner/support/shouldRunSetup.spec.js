import test from 'tape'
import shouldRunSetup from './shouldRunSetup'

test('shouldRunSetup - Type', assert => {
  const expected = 'function'
  const actual = typeof shouldRunSetup

  assert.equal(actual, expected, 'shouldRunSetup should be a function')

  assert.end()
})

test('shouldRunSetup - first execution - default', assert => {
  let expected = true
  let actual = shouldRunSetup(null, 0)

  assert.equal(
    actual,
    expected,
    'shouldRunSetup should return `true` on first execution (index = 0)'
  )

  assert.end()
})

test('shouldRunSetup - first execution - repeat object', assert => {
  let expected = true
  let actual = shouldRunSetup(
    {
      setup: true,
    },
    0
  )

  assert.equal(
    actual,
    expected,
    'shouldRunSetup should return `true` on first execution (index = 0)'
  )

  assert.end()
})

test('shouldRunSetup - next executions - default', assert => {
  let results = []

  for (let i = 1; i < 5; i++) {
    results.push(shouldRunSetup(null, i))
  }

  let actual = results.filter(item => item === false).length
  let expected = 4
  assert.equal(
    actual,
    expected,
    'shouldRunSetup should return false by default for next executions'
  )

  assert.end()
})

test('shouldRunSetup - next executions - repeat object false', assert => {
  let results = []

  for (let i = 1; i < 5; i++) {
    results.push(shouldRunSetup({ setup: false }, i))
  }

  let actual = results.filter(item => item === false).length
  let expected = 4
  assert.equal(
    actual,
    expected,
    'shouldRunSetup should return false by when setup is false in repeat object for next execution'
  )

  assert.end()
})

test('shouldRunSetup - next executions - repeat object true', assert => {
  let results = []

  for (let i = 1; i < 5; i++) {
    results.push(shouldRunSetup({ setup: true }, i))
  }

  let actual = results.filter(item => item === true).length
  let expected = 4
  assert.equal(
    actual,
    expected,
    'shouldRunSetup should return true by when setup is true in repeat object for next execution'
  )

  assert.end()
})
