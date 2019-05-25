// eslint-disable-next-line
require = require('esm')(module)

const test = require('tape')
const calculateSleep = require('./calculateSleep').default

test('calculateSleep - Type', assert => {
  const expected = 'function'
  const actual = typeof calculateSleep

  assert.equal(actual, expected, 'calculateSleep should be a function')

  assert.end()
})

test('calculateSleep - Convert seconds to milliseconds', assert => {
  const expected = 2000
  const actual = calculateSleep(2)

  assert.equal(actual, expected, 'seconds should be multiplied by 1000')
  assert.end()
})

test('calculateSleep - Sleep as a function', assert => {
  const sleepFunction = () => {
    return 2.5 * 2
  }
  const expected = 5000
  const actual = calculateSleep(sleepFunction)

  assert.equal(
    actual,
    expected,
    'seconds to sleep should be properly calculated when passed as a function'
  )
  assert.end()
})
