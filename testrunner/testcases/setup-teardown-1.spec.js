import test from 'tape-promise/tape'

import Runner from '../index'
import Reporter from '../reporters/tdd'

import testCase from './setup-teardown-1'

const reporter = Reporter()

test('Setup Teardown 1 - Synchronous', assert => {
  Runner(testCase, reporter).then(res => {
    const results = reporter.results

    // should run the setup method first
    let expected = { action: 'log', arguments: ['Running Test Setup'] }
    let actual = results[1]
    assert.deepEqual(actual, expected, 'should run the setup method first')

    // 1 step should pass
    expected = 1
    actual = results.map(item => item.action).filter(item => item === 'pass').length
    assert.equal(actual, expected, 'should have 1 passing steps')

    // test should be a success
    expected = true
    actual = results.map(item => item.action).indexOf('success') > -1
    assert.equal(actual, expected, 'should be successfull')

    // should run the teardown method last
    expected = { action: 'log', arguments: ['Running Test Teardown'] }
    actual = results[4]
    assert.deepEqual(actual, expected, 'should run the teardown method last')

    // runner should finish
    expected = true
    actual = results.map(item => item.action).indexOf('finished') > -1
    assert.equal(actual, expected, 'should finish until the end')

    assert.end()
  })
})
