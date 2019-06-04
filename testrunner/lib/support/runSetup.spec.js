import test from 'tape'
import runSetup from './runSetup'
import sinon from 'sinon'

const reporter = {
  log() {},
}
const reporterLogSpy = sinon.spy(reporter, 'log')

test('runSetup - Type', assert => {
  const expected = 'function'
  const actual = typeof runSetup

  assert.equal(actual, expected, 'runSetup should be a function')

  assert.end()
})

test('runSetup - passing a regular function', assert => {
  reporterLogSpy.resetHistory()

  const result = runSetup({ reporter }, () => {})

  let expected = true
  let actual = reporterLogSpy.calledOnce
  assert.equal(expected, actual, 'should call reporter log method once')

  actual = reporterLogSpy.calledWith('Running Test Setup')
  assert.ok(actual, 'should log `Running Test Setup`')

  actual = typeof result.then === 'function' && typeof result.catch === 'function'
  assert.ok(actual, 'should return a promise')

  assert.end()
})

test('runSetup - passing a function with a promise', assert => {
  reporterLogSpy.resetHistory()

  const promise = new Promise((resolve, reject) => {})
  const result = runSetup({ reporter }, () => promise)

  let expected = true
  let actual = reporterLogSpy.calledOnce
  assert.equal(expected, actual, 'should call reporter log method once')

  actual = reporterLogSpy.calledWith('Running Test Setup')
  assert.ok(actual, 'should log `Running Test Setup`')

  actual = typeof result.then === 'function' && typeof result.catch === 'function'
  assert.ok(actual, 'should return a promise')

  assert.end()
})

test('runSetup - passing not a function (i.e. string)', assert => {
  reporterLogSpy.resetHistory()

  const result = runSetup({ reporter }, '')

  let expected = 0
  let actual = reporterLogSpy.callCount
  assert.equal(expected, actual, 'should not call reporter log method')

  actual = typeof result.then === 'function' && typeof result.catch === 'function'
  assert.ok(actual, 'should return a promise')

  reporterLogSpy.restore()
  assert.end()
})
