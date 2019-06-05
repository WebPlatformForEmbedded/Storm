import test from 'tape-promise/tape'

import Runner from '../index'
import Reporter from '../reporters/tdd'

import testCase from './repeat-3'

const reporter = Reporter()

test('Repeat 3 - setup / teardown executed once', assert => {
  Runner(testCase, reporter).then(() => {
    const results = reporter.results

    // Dummy - Repeat - 2
    let expected = 4
    let actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments.length &&
        typeof item.arguments[0] === 'string' &&
        item.arguments[0].includes('Dummy - Repeat - 3')
      )
    }).length

    assert.equal(
      actual,
      expected,
      'should have 4 executions (1 initial + 3 repeats) of the testcase `Dummy - Repeat - 3`'
    )

    // 8 steps should pass
    expected = 8
    actual = results.map(item => item.action).filter(item => item === 'pass').length
    assert.equal(actual, expected, 'should have 8 passing steps (2 steps, 4 test executions)')

    // should run the setup method first
    expected = { action: 'log', arguments: ['Running Test Setup'] }
    actual = results[2]
    assert.deepEqual(actual, expected, 'should run the setup method first')

    // should call the setup method once
    actual =
      results.filter(item => {
        return item.arguments && item.arguments[0] === 'Running Test Setup'
      }).length === 1
    assert.ok(actual, 'should call setup method once')

    // should call the setup method once
    actual =
      results.filter(item => {
        return item.arguments && item.arguments[0] === 'Running Test Teardown'
      }).length === 1
    assert.ok(actual, 'should call teardown method once')

    // should run the teardown method last
    expected = { action: 'log', arguments: ['Running Test Teardown'] }
    actual = results[results.length - 4]
    assert.deepEqual(actual, expected, 'should run the teardown method last')

    assert.end()
  })
})
