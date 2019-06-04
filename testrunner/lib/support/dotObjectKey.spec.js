import test from 'tape'
import dotObjectKey from './dotObjectKey'

test('dotObjectKey - Type', assert => {
  let expected = 'object'
  let actual = typeof dotObjectKey
  assert.equal(actual, expected, 'dotObjectKey should be an object')

  expected = ['get', 'assign']
  actual = Object.keys(dotObjectKey)
  assert.deepEqual(actual, expected, 'dotObjectKey should have a `get` key and an `assign` key')

  expected = 'function'
  actual = typeof dotObjectKey.get
  assert.equal(actual, expected, 'dotObjectKey.get should be a function')

  expected = 'function'
  actual = typeof dotObjectKey.assign
  assert.equal(actual, expected, 'dotObjectKey.assign should be a function')

  assert.end()
})

test('dotObjectKey - assign', assert => {
  let expected = { foo: 'bar' }
  let actual = dotObjectKey.assign({}, 'foo', 'bar')

  assert.deepEqual(
    actual,
    expected,
    'should assign a value to a key when an empty object is passed'
  )

  expected = { foo: 'bar', bla: 'boe' }
  actual = dotObjectKey.assign(actual, 'bla', 'boe')

  assert.deepEqual(actual, expected, 'should add key value pair to and existing object')

  expected = { foo: 'bar', bla: 'hi' }
  actual = dotObjectKey.assign(actual, 'bla', 'hi')

  assert.deepEqual(actual, expected, 'should change value of existing key in an object')

  assert.end()
})

test('dotObjectKey - assign nested dot-snotation', assert => {
  let expected = { foo: { bar: 'hi' } }
  let actual = dotObjectKey.assign({}, 'foo.bar', 'hi')

  assert.deepEqual(
    actual,
    expected,
    'should assign a nested key with a value when dot-notation is used and an empty object is passed'
  )

  expected = { foo: { bar: 'hi', hey: 'yo' } }
  actual = dotObjectKey.assign(actual, 'foo.hey', 'yo')

  assert.deepEqual(
    actual,
    expected,
    'should add a nested key value pair to and existing object when dot-notation is used '
  )

  expected = { foo: { bar: 'hi', hey: 'hello' } }
  actual = dotObjectKey.assign(actual, 'foo.hey', 'hello')

  assert.deepEqual(
    actual,
    expected,
    'should change nested value of existing key in an object when using dot-notation'
  )

  assert.end()
})

test('dotObjectKey - assign deep nested dot-snotation', assert => {
  let expected = { foo: { bar: 'hi', bla: { john: 'doe' } } }
  let actual = dotObjectKey.assign({}, 'foo.bar', 'hi')
  actual = dotObjectKey.assign(actual, 'foo.bla.john', 'doe')

  assert.deepEqual(
    actual,
    expected,
    'should assign a deep nested key with a value when dot-notation is used and an empty object is passed'
  )

  assert.end()
})

test('dotObjectKey - get', assert => {
  let obj = {
    foo: 'bar',
    bla: {
      test: '123',
      test2: {
        yo: 'hello',
      },
    },
  }

  let expected = 'bar'
  let actual = dotObjectKey.get(obj, 'foo')
  assert.equal(actual, expected, 'should get a root key value')

  expected = '123'
  actual = dotObjectKey.get(obj, 'bla.test')
  assert.equal(actual, expected, 'should get a nested key value using dot-notation')

  expected = 'hello'
  actual = dotObjectKey.get(obj, 'bla.test2.yo')
  assert.equal(actual, expected, 'should get a deep nested key value usin dot-notation')

  expected = null
  actual = dotObjectKey.get(obj, '404')
  assert.equal(actual, expected, 'should return null when getting a non existing root key')

  expected = null
  actual = dotObjectKey.get(obj, 'i.dont.exist.at.all')
  assert.equal(actual, expected, 'should return null when getting a non existing deep nested key')

  assert.end()
})
