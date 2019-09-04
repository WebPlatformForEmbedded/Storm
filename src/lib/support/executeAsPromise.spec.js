import test from 'tape'
import executeAsPromise from './executeAsPromise'

test('executeAsPromise - Type', assert => {
  let expected = 'function'
  let actual = typeof executeAsPromise
  assert.equal(actual, expected, 'executeAsPromise should be a function')

  assert.end()
})

test('executeAsPromise - pass a promise', assert => {
  const promise = new Promise((resolve, reject) => {
    let rand = Math.random()
    if (rand >= 0.5) {
      resolve()
    } else {
      reject()
    }
  })
  let actual = executeAsPromise(promise)
  assert.ok(
    typeof actual.then === 'function' && typeof actual.catch === 'function',
    'should return a promise when passed a promise'
  )

  assert.end()
})

test('executeAsPromise - pass a normal function', assert => {
  let actual = executeAsPromise(function() {
    return 'ok'
  })
  assert.ok(
    typeof actual.then === 'function' && typeof actual.catch === 'function',
    'should return a promise when passed a function'
  )

  assert.end()
})

test('executeAsPromise - pass a value (i.e. not a function)', assert => {
  let actual = executeAsPromise('hello!')
  assert.ok(
    typeof actual.then === 'function' && typeof actual.catch === 'function',
    'should return a promise when passed a value'
  )

  actual.then(val => {
    assert.equal(val, 'hello!', 'should return the passed value as the return of the promise')
    assert.end()
  })
})
