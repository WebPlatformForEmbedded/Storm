import test from 'tape'
import runTeardown from './runTeardown'
import sinon from 'sinon'

const reporter = {
  log() {},
}
const reporterLogSpy = sinon.spy(reporter, 'log')

test('runTeardown - Type', assert => {
  const expected = 'function'
  const actual = typeof runTeardown

  assert.equal(actual, expected, 'runTeardown should be a function')

  assert.end()
})

test('runTeardown - passing a regular function', assert => {
  reporterLogSpy.resetHistory()

  const result = runTeardown({ reporter }, () => {})

  let expected = true
  let actual = reporterLogSpy.calledOnce
  assert.equal(expected, actual, 'should call reporter log method once')

  actual = reporterLogSpy.calledWith('Running Test Teardown')
  assert.ok(actual, 'should log `Running Test Teardown`')

  actual = typeof result.then === 'function' && typeof result.catch === 'function'
  assert.ok(actual, 'should return a promise')

  assert.end()
})

test('runTeardown - passing a function with a promise', assert => {
  reporterLogSpy.resetHistory()

  const promise = new Promise((resolve, reject) => {})
  const result = runTeardown({ reporter }, () => promise)

  let expected = true
  let actual = reporterLogSpy.calledOnce
  assert.equal(expected, actual, 'should call reporter log method once')

  actual = reporterLogSpy.calledWith('Running Test Teardown')
  assert.ok(actual, 'should log `Running Test Teardown`')

  actual = typeof result.then === 'function' && typeof result.catch === 'function'
  assert.ok(actual, 'should return a promise')

  assert.end()
})

test('runTeardown - passing not a function (i.e. string)', assert => {
  reporterLogSpy.resetHistory()

  const result = runTeardown({ reporter }, '')

  let expected = 0
  let actual = reporterLogSpy.callCount
  assert.equal(expected, actual, 'should not call reporter log method')

  actual = typeof result.then === 'function' && typeof result.catch === 'function'
  assert.ok(actual, 'should return a promise')

  reporterLogSpy.restore()
  assert.end()
})
