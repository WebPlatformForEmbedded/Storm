import test from 'tape-promise/tape'

import Runner from '../src/index'
import Reporter from '../src/reporters/tdd'

import testCase from '../testcases/extending-2'

const reporter = Reporter()

test('Extending 2 - extending basic test with setup and teardown', assert => {
  Runner(testCase, reporter).then(res => {
    const results = reporter.results

    // should log the new title instead of basic test title
    let expected = -1
    let actual = results.findIndex(item => {
      return item.action === 'log' && item.arguments[0] === 'Executing Dummy - Basic functionality'
    })

    assert.equal(expected, actual, 'should not log title of basic test that is being extended')

    actual = results.findIndex(item => {
      return item.action === 'log' && item.arguments[0] === 'Executing Dummy - Extending - 2'
    })

    assert.ok(actual > -1, 'should log new title instead of basic test that is being extended')

    // should execute setup
    actual = results.findIndex(item => {
      return (
        item.action === 'log' &&
        item.arguments[0] === 'I am a setup method, that did not exist in the base test'
      )
    })

    assert.ok(
      actual > -1,
      'should execute the setup method that does not exist on the extended test case'
    )

    // should execute teardown
    actual = results.findIndex(item => {
      return (
        item.action === 'log' &&
        item.arguments[0] === 'I am a teardown method, that did not exist in the base test'
      )
    })

    assert.ok(
      actual > -1,
      'should execute the teardown method that does not exist on the extended test case'
    )

    // 4 steps should pass
    expected = 4
    actual = results.map(item => item.action).filter(item => item === 'pass').length
    assert.equal(actual, expected, 'should have 4 passing steps (from basic)')

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
