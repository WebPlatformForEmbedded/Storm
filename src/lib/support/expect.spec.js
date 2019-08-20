import test from 'tape'
import expect from './expect'

test('expect - Type', assert => {
  const expected = 'function'
  const actual = typeof expect

  assert.equal(actual, expected, 'expect should be a function')

  assert.end()
})

test('expect - return all the assert methods from the expect library', assert => {
  // a sample of methods that should exist on the expect instance
  const methods = ['toBe', 'toBeCloseTo', 'toContain', 'toEqual', 'not', 'toBeLessThan']
  const availableMethods = Object.keys(expect(true))

  methods.forEach(method => {
    assert.ok(availableMethods.indexOf(method) > -1, 'Expect should have `' + method + '` method')
  })

  assert.end()
})

test('expect - return custom expect matchers', assert => {
  const methods = ['toBeWithinRange', 'toBeHttpNotFound', 'tobeHttpSuccess', 'toBeHttpStatus']
  const availableMethods = Object.keys(expect(true))

  methods.forEach(method => {
    assert.ok(availableMethods.indexOf(method) > -1, 'Expect should have `' + method + '` method')
  })

  assert.end()
})

test('expect - return true on pass, error on fail', assert => {
  let expected = true
  let actual = expect('hello').toBe('hello')
  assert.equal(expected, actual, 'should return true when the assertion passes')

  actual = expect('hello').toBe('hi')
  assert.ok(actual instanceof Error, 'should return and Error when the assertion fails')

  assert.end()
})
