import test from 'tape'
import expect from './expect'

test('expect - Type', assert => {
  const expected = 'function'
  const actual = typeof expect

  assert.equal(actual, expected, 'expect should be a function')

  assert.end()
})

test('expect - return true on pass, error on fail', assert => {
  let expected = true
  let actual = expect('hello').to.equal('hello')
  assert.equal(expected, actual, 'should return true when the assertion passes')

  actual = expect('hello').to.equal('hi')
  assert.ok(actual instanceof Error, 'should return and Error when the assertion fails')

  assert.end()
})
