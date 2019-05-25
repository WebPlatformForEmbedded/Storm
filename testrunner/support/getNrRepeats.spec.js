// eslint-disable-next-line
require = require('esm')(module)

const test = require('tape')
const getNrRepeats = require('./getNrRepeats').default

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
