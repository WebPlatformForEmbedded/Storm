import test from 'tape-promise/tape'

import Runner from '../index'
import Reporter from '../reporters/tdd'

import testCase from './test-validate-2'

const reporter = Reporter()

test('Validate 2 - failing test validation', assert => {
  Runner(testCase, reporter).catch(res => {
    const results = reporter.results

    // 3 steps should pass
    let expected = 3
    let actual = results.map(item => item.action).filter(item => item === 'pass').length
    assert.equal(actual, expected, 'should have 3 passing steps')

    // no step should fail
    expected = 0
    actual = results.map(item => item.action).filter(item => item === 'fail').length
    assert.equal(actual, expected, 'should have no failing steps')

    // test should throw an error
    let result = results.filter(item => item.action === 'error')
    expected = 1
    actual = result.length
    assert.equal(actual, expected, 'should have an error')

    expected = 'Validation failed'
    actual = result[0].arguments[1].message
    assert.equal(actual, expected, 'error message should be `Validation failed`')

    assert.end()
  })
})
