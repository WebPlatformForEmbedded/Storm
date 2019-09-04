import test from 'tape'
import calculateSleep from './calculateSleep'

test('calculateSleep - Type', assert => {
  const expected = 'function'
  const actual = typeof calculateSleep

  assert.equal(actual, expected, 'calculateSleep should be a function')

  assert.end()
})

test('calculateSleep - return as promise', assert => {
  const actualValue = calculateSleep(2)

  assert.ok(
    typeof actualValue.then === 'function' && typeof actualValue.catch === 'function',
    'should return a promise when passed a value'
  )

  const actualFunction = calculateSleep(() => {})

  assert.ok(
    typeof actualFunction.then === 'function' && typeof actualFunction.catch === 'function',
    'should return a promise when passed a function'
  )

  assert.end()
})

test('calculateSleep - Convert seconds to milliseconds', assert => {
  const expected = 2000

  calculateSleep(2).then(actual => {
    assert.equal(actual, expected, 'seconds should be multiplied by 1000')
    assert.end()
  })
})

test('calculateSleep - Sleep as a function', assert => {
  const sleepFunction = () => {
    return 2.5 * 2
  }
  const expected = 5000

  calculateSleep(sleepFunction).then(actual => {
    assert.equal(
      actual,
      expected,
      'seconds to sleep should be properly calculated when passed as a function'
    )
    assert.end()
  })
})
