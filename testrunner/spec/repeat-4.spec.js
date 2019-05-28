import test from 'tape-promise/tape'

import Runner from '../index'
import Reporter from '../reporters/tdd'

import testCase from '../../tests/dummy/repeat-4'

const reporter = Reporter()

test('Repeat 4 - defined as object', assert => {
  Runner(testCase, reporter).then(() => {
    const results = reporter.results

    let expected = 2
    let actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments.length &&
        typeof item.arguments[0] === 'string' &&
        item.arguments[0].includes('Dummy - Repeat - 4')
      )
    }).length

    assert.equal(actual, expected, 'should have 3 executions of the testcase `Dummy - Repeat - 4`')

    // 8 steps should pass
    expected = 8
    actual = results.map(item => item.action).filter(item => item === 'pass').length
    assert.equal(actual, expected, 'should have 8 passing steps')

    // Just a basic test step that should run 3 times
    expected = 2 * 3
    actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments.length &&
        typeof item.arguments[0] === 'string' &&
        item.arguments[0].includes('Just a basic test step that should run 3 times')
      )
    }).length

    assert.equal(
      actual,
      expected,
      'should have 2 x 3 executions of `Just a basic test step that should run 3 times`'
    )

    // Just another basic test step
    expected = 2
    actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments.length &&
        typeof item.arguments[0] === 'string' &&
        item.arguments[0].includes('Just another basic test step')
      )
    }).length

    assert.equal(actual, expected, 'should have 2 executions of `Just another basic test step`')

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
