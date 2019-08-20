import test from 'tape-promise/tape'

import Runner from '../src/index'
import Reporter from '../src/reporters/tdd'

import testCase from '../testcases/validation-helpers-2'

const reporter = Reporter()

test('Validation helper 2', assert => {
  Runner(testCase, reporter).catch(() => {
    const results = reporter.results

    // 1 steps should fail
    let expected = 1
    let actual = results.map(item => item.action).filter(item => item === 'fail').length
    assert.equal(actual, expected, 'should have 1 failing step')

    // test should not be a success
    expected = true
    actual = results.map(item => item.action).indexOf('error') > -1
    assert.equal(actual, expected, 'should not be successful')

    assert.end()
  })
})
