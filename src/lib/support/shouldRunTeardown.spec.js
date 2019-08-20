import test from 'tape'
import shouldRunTeardown from './shouldRunTeardown'

test('shouldRunTeardown - Type', assert => {
  const expected = 'function'
  const actual = typeof shouldRunTeardown

  assert.equal(actual, expected, 'shouldRunTeardown should be a function')

  assert.end()
})

test('shouldRunTeardown - no repeat', assert => {
  let expected = true
  let actual = shouldRunTeardown(null, 0)

  assert.equal(
    actual,
    expected,
    'shouldRunTeardown should return `true` on first execution when no repeats'
  )

  assert.end()
})

test('shouldRunTeardown - last execution, repeat as number', assert => {
  let results = []
  let nrRepeats = 5

  for (let i = 0; i < nrRepeats + 1; i++) {
    results.push(shouldRunTeardown(nrRepeats, i))
  }

  let actual = results[nrRepeats]
  let expected = true

  assert.equal(
    actual,
    expected,
    'shouldRunTeardown should return `true` on last execution when repeat is defined as a number'
  )

  actual = results.filter(item => item === false).length
  expected = 5

  assert.equal(
    actual,
    expected,
    'shouldRunTeardown should return `false` on all but the last execution when repeat is defined as a number'
  )

  assert.end()
})

test('shouldRunTeardown - last execution, repeat as object', assert => {
  let results = []
  let nrRepeats = 5
  for (let i = 0; i < nrRepeats + 1; i++) {
    results.push(shouldRunTeardown({ times: nrRepeats }, i))
  }

  let actual = results[nrRepeats]
  let expected = true

  assert.equal(
    actual,
    expected,
    'shouldRunTeardown should return `true` on last execution when repeats is defined as an object'
  )

  actual = results.filter(item => item === false).length
  expected = 5

  assert.equal(
    actual,
    expected,
    'shouldRunTeardown should return `false` on all but the last execution when repeat is defined as an object'
  )

  assert.end()
})

test('shouldRunTeardown - each execution, object repeat', assert => {
  let results = []
  let nrRepeats = 5
  for (let i = 0; i < nrRepeats + 1; i++) {
    results.push(shouldRunTeardown({ times: nrRepeats, teardown: true }, i))
  }

  let actual = results.filter(item => item === true).length
  let expected = 6

  assert.equal(
    actual,
    expected,
    'shouldRunTeardown should return `true` on all execution when repeat is defined as an object with teardown set to true'
  )

  assert.end()
})
