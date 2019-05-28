import test from 'tape-promise/tape'

import Runner from '../index'
import Reporter from '../reporters/tdd'

import testCase from '../../tests/dummy/repeat-7'

const reporter = Reporter()

test('Repeat 7 - test with sleep', assert => {
  const start = new Date()

  Runner(testCase, reporter).then(() => {
    const results = reporter.results

    let expected = 3
    let actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments.length &&
        typeof item.arguments[0] === 'string' &&
        item.arguments[0].includes('Dummy - Repeat - 7')
      )
    }).length

    assert.equal(actual, expected, 'should have 3 executions of the testcase `Dummy - Repeat - 7`')

    // 6 steps should pass
    expected = 6
    actual = results.map(item => item.action).filter(item => item === 'pass').length
    assert.equal(actual, expected, 'should have 6 passing steps (2 steps, 3 test repeats)')

    // test should take at least 15 secondso finish
    expected = 15
    actual = (new Date() - start) / 1000

    assert.ok(
      actual >= expected,
      'should take between at leats 15 seconds (3 x 5 seconds sleep) to finish (actual: ' +
        actual +
        ')'
    )

    assert.end()
  })
})
