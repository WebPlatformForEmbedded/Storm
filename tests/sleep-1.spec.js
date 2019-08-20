import test from 'tape-promise/tape'

import Runner from '../src/index'
import Reporter from '../src/reporters/tdd'

import testCase from '../testcases/sleep-1'

const reporter = Reporter()

test('Sleep 1 - steps', assert => {
  const start = new Date()

  Runner(testCase, reporter).then(res => {
    const results = reporter.results

    // 7 steps should pass
    let expected = 7
    let actual = results.map(item => item.action).filter(item => item === 'pass').length
    assert.equal(actual, expected, 'should have 7 passing steps')

    // 4 steps should have a sleep
    expected = 4
    actual = results.filter(item => item.action === 'sleep').length
    assert.equal(actual, expected, 'should have 4 steps with sleep')

    // reported sleep should be 13,5 seconds
    expected = 13.5
    actual =
      results
        .filter(item => item.action === 'sleep')
        .reduce((total, item) => {
          return total + item.arguments[0]
        }, 0) / 1000

    assert.equal(actual, expected, 'should report a total of 13,5 seconds of sleep')

    // test should take at least 13,5 seconds to finish
    expected = 13.5
    actual = (new Date() - start) / 1000

    assert.ok(
      actual >= expected,
      'should take at least 13,5 seconds to finish (actual: ' + actual + ')'
    )

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
