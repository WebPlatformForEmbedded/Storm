import test from 'tape-promise/tape'

import Runner from '../index'
import Reporter from '../reporters/tdd'

import testCase from '../../tests/dummy/logger'

const reporter = Reporter()

test('Logger', assert => {
  Runner(testCase, reporter).then(() => {
    const results = reporter.results

    let expected
    let actual

    // log from setup
    actual = results.findIndex(item => {
      return item.action === 'log' && item.arguments[0] === 'Hey! I am a setup method!'
    })

    assert.ok(actual > -1, 'should log `Hey! I am a setup method!` from the setup method')

    // log from teardown
    actual = results.findIndex(item => {
      return item.action === 'log' && item.arguments[0] === 'Hey! I am a teardown method!'
    })

    assert.ok(actual > -1, 'should log `Hey! I am a teardown method!` from the teardown method')

    // log from a step test
    actual = results.findIndex(item => {
      return (
        item.action === 'log' &&
        item.arguments[0] === 'Hey! This is a custom log message in a test step!'
      )
    })

    assert.ok(
      actual > -1,
      'should log `Hey! This is a custom log message in a test step!` from the step test method'
    )

    // log from a step validation
    actual = results.findIndex(item => {
      return (
        item.action === 'log' &&
        item.arguments[0] === 'Hey! This is a custom log message in a step validation!'
      )
    })

    assert.ok(
      actual > -1,
      'should log `Hey! This is a custom log message in a step validation!` from the step validation method'
    )

    // log from a test validation
    actual = results.findIndex(item => {
      return (
        item.action === 'log' &&
        item.arguments[0] === 'Hey! This is a custom log message in a test validation!'
      )
    })

    assert.ok(
      actual > -1,
      'should log `Hey! This is a custom log message in a test validation!` from the test validation method'
    )

    // test should be a success
    expected = true
    actual = results.map(item => item.action).indexOf('success') > -1
    assert.equal(actual, expected, 'should be successfull')

    // runner should finish
    expected = true
    actual = results.map(item => item.action).indexOf('finished') > -1
    assert.equal(actual, expected, 'should finish until the end')

    assert.end()
  })
})
