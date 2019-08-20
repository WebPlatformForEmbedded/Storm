import test from 'tape-promise/tape'

import Runner from '../src/index'
import Reporter from '../src/reporters/tdd'

import testCase from '../testcases/repeat-2'

const reporter = Reporter()

test('Repeat 2 - test', assert => {
  Runner(testCase, reporter).then(() => {
    const results = reporter.results

    // Dummy - Repeat - 2
    let expected = 4 // initial execution + 3 repeats
    let actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments.length &&
        typeof item.arguments[0] === 'string' &&
        item.arguments[0].includes('Dummy - Repeat - 2')
      )
    }).length

    assert.equal(
      actual,
      expected,
      'should have 4 executions (initial execution + 3 repeats) of the testcase `Dummy - Repeat - 2`'
    )

    // 8 steps should pass
    expected = 8
    actual = results.map(item => item.action).filter(item => item === 'pass').length
    assert.equal(actual, expected, 'should have 8 passing steps (2 steps, 4 test executions)')

    assert.end()
  })
})
