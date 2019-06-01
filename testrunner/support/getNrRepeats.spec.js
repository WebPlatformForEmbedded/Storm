import test from 'tape'
import getNrRepeats from './getNrRepeats'

test('getNrRepeats - Type', assert => {
  const expected = 'function'
  const actual = typeof getNrRepeats

  assert.equal(actual, expected, 'getNrRepeats should be a function')

  assert.end()
})

test('getNrRepeats - Object as input', assert => {
  const expected = 10
  const actual = getNrRepeats({
    times: 10,
  })

  assert.equal(actual, expected, 'nr of repeats should read the `times` key of an object')
  assert.end()
})

test('getNrRepeats - false as input', assert => {
  const expected = 1
  const actual = getNrRepeats(false)

  assert.equal(actual, expected, 'nr of repeats should default to 1 if passed false')
  assert.end()
})

test('getNrRepeats - null as input', assert => {
  const expected = 1
  const actual = getNrRepeats(null)

  assert.equal(actual, expected, 'nr of repeats should default to 1 if passed null')
  assert.end()
})
