import test from 'tape-promise/tape'

import Runner from '../index'
import Reporter from '../reporters/tdd'

import testCase from '../../tests/dummy/repeat-6'

const reporter = Reporter()

test('Repeat 6 - setup / teardown executed every repeat', assert => {
  Runner(testCase, reporter).then(() => {
    const results = reporter.results

    let expected = 2
    let actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments.length &&
        typeof item.arguments[0] === 'string' &&
        item.arguments[0].includes('Dummy - Repeat - 6')
      )
    }).length

    assert.equal(actual, expected, 'should have 2 executions of the testcase `Dummy - Repeat - 6`')

    // 4 steps should pass
    expected = 4
    actual = results.map(item => item.action).filter(item => item === 'pass').length
    assert.equal(actual, expected, 'should have 4 passing steps (2 steps, 2 test repeats)')

    // should call the setup method twice
    actual =
      results.filter(item => {
        return item.arguments && item.arguments[0] === 'Running Test Setup'
      }).length === 2
    assert.ok(actual, 'should call setup method twice')

    // should call the teardown method twice
    actual =
      results.filter(item => {
        return item.arguments && item.arguments[0] === 'Running Test Teardown'
      }).length === 2
    assert.ok(actual, 'should call teardown method twice')

    // should run setup and teardown the correct order
    let firstSetup = results.findIndex(item => {
      return item.action === 'log' && item.arguments[0] === 'Running Test Setup'
    })

    let secondSetup = results.findIndex((item, index) => {
      return (
        index > firstSetup && item.action === 'log' && item.arguments[0] === 'Running Test Setup'
      )
    })

    let firstTeardown = results.findIndex(item => {
      return item.action === 'log' && item.arguments[0] === 'Running Test Teardown'
    })

    let secondTeardown = results.findIndex((item, index) => {
      return (
        index > firstSetup && item.action === 'log' && item.arguments[0] === 'Running Test Teardown'
      )
    })

    assert.ok(
      firstSetup < firstTeardown < secondSetup < secondTeardown,
      'should run in the correct order (setup 1 -> teardown 1 -> setup 2 -> teardown 2)'
    )

    assert.end()
  })
})
