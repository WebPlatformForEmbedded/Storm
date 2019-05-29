import test from 'tape'
import runValidate from './runValidate'

test('runValidate - Type', assert => {
  const expected = 'function'
  const actual = typeof runValidate

  assert.equal(actual, expected, 'runValidate should be a function')

  assert.end()
})

test('runValidate - passing a regular function', assert => {
  const result = runValidate({}, () => true, true)

  let actual = typeof result.then === 'function' && typeof result.catch === 'function'
  assert.ok(actual, 'should return a promise')

  assert.end()
})

test('runValidate - passing a failing validate function', assert => {
  let expected = 'Validation failed'

  runValidate({}, () => false, true).catch(e => {
    let actual = e.message
    assert.equals(expected, actual, 'should throw an error `Validation failed`')
    assert.end()
  })
})

test('runValidate - passing not a function (i.e. string)', assert => {
  const result = runValidate({}, '', true)

  let actual = typeof result.then === 'function' && typeof result.catch === 'function'
  assert.ok(actual, 'should return a promise')

  assert.end()
})
