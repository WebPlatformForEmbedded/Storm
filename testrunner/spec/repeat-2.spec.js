import test from 'tape-promise/tape'

import Runner from '../index'
import Reporter from '../reporters/tdd'

import testCase from '../../tests/dummy/repeat-2'

const reporter = Reporter()

test('Repeat 2 - test', assert => {
  Runner(testCase, reporter).then(() => {
    const results = reporter.results

    // Dummy - Repeat - 2
    let expected = 3
    let actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments.length &&
        typeof item.arguments[0] === 'string' &&
        item.arguments[0].includes('Dummy - Repeat - 2')
      )
    }).length

    assert.equal(actual, expected, 'should have 3 executions of the testcase `Dummy - Repeat - 2`')

    // 6 steps should pass
    expected = 6
    actual = results.map(item => item.action).filter(item => item === 'pass').length
    assert.equal(actual, expected, 'should have 6 passing steps (2 steps, 3 test repeats')

    assert.end()
  })
})
