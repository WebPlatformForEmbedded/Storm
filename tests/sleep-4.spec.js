import test from 'tape-promise/tape'

import Runner from '../src/index'
import Reporter from '../src/reporters/tdd'

import testCase from '../testcases/sleep-4'

const reporter = Reporter()

test('Sleep 4 - sleep function with promise', assert => {
  const start = new Date()

  Runner(testCase, reporter).then(res => {
    const results = reporter.results

    // 2 steps should pass
    let expected = 2
    let actual = results.map(item => item.action).filter(item => item === 'pass').length
    assert.equal(actual, expected, 'should have 2 passing steps')

    // 1 step should have a sleep (the second step)
    expected = 1
    actual = results.filter(item => item.action === 'sleep').length
    assert.equal(actual, expected, 'should have 1 step with sleep')

    // test should take at least 10 (2 + 5 + 2 + 1) seconds to finish
    expected = 10
    actual = (new Date() - start) / 1000

    assert.ok(
      actual >= expected,
      'should take at least 10 seconds to finish (actual: ' + actual + ')'
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
