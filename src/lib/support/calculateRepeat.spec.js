import test from 'tape'
import calculateRepeat from './calculateRepeat'

test('calculateRepeat - Type', assert => {
  const expected = 'function'
  const actual = typeof calculateRepeat

  assert.equal(actual, expected, 'calculateRepeat should be a function')

  assert.end()
})

test('calculateRepeat - Repeat as a function', assert => {
  const randomInt = Math.floor(Math.random() * 10)

  const repeatFunction = () => {
    return randomInt
  }
  const expected = randomInt
  const actual = calculateRepeat(repeatFunction)

  assert.equal(
    actual,
    expected,
    'nr of repeats should be properly calculated when passed as a function'
  )
  assert.end()
})
