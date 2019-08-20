import test from 'tape-promise/tape'

import Runner from '../src/index'
import Reporter from '../src/reporters/tdd'

import testCase from '../testcases/repeat-7'

const reporter = Reporter()

test('Repeat 7 - test with sleep', assert => {
  const start = new Date()

  Runner(testCase, reporter).then(() => {
    const results = reporter.results

    let expected = 4
    let actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments.length &&
        typeof item.arguments[0] === 'string' &&
        item.arguments[0].includes('Dummy - Repeat - 7')
      )
    }).length

    assert.equal(actual, expected, 'should have 4 executions of the testcase `Dummy - Repeat - 7`')

    // 8 steps should pass
    expected = 8
    actual = results.map(item => item.action).filter(item => item === 'pass').length
    assert.equal(actual, expected, 'should have 8 passing steps (2 steps, 4 test executions)')

    // test should take at least 20 secondso finish
    expected = 20
    actual = (new Date() - start) / 1000

    assert.ok(
      actual >= expected,
      'should take between at leats 20 seconds (4 x 5 seconds sleep) to finish (actual: ' +
        actual +
        ')'
    )

    assert.end()
  })
})
