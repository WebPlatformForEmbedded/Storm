import test from 'tape-promise/tape'

import Runner from '../index'
import Reporter from '../reporters/tdd'

import testCase from './validation-helpers-3'

const reporter = Reporter()

test('Validation helper 3', assert => {
  Runner(testCase, reporter).then(res => {
    const results = reporter.results

    // 3 steps should pass
    let expected = 3
    let actual = results.map(item => item.action).filter(item => item === 'pass').length
    assert.equal(actual, expected, 'should have 3 passing steps')

    // test should be a success
    expected = true
    actual = results.map(item => item.action).indexOf('success') > -1
    assert.equal(actual, expected, 'should be successful')

    // runner should finish
    expected = true
    actual = results.map(item => item.action).indexOf('finished') > -1
    assert.equal(actual, expected, 'should finish until the end')

    assert.end()
  })
})
