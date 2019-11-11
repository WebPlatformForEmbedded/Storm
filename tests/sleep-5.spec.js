import test from 'tape-promise/tape'

import Runner from '../src/index'
import Reporter from '../src/reporters/tdd'

import testCase from '../testcases/sleep-5'

const reporter = Reporter()

test('Sleep 5 - sleep once functionality', assert => {
  const start = new Date()

  Runner(testCase, reporter).then(res => {
    const results = reporter.results

    // 9 steps should pass
    let expected = 9
    let actual = results.map(item => item.action).filter(item => item === 'pass').length
    assert.equal(actual, expected, 'should have 9 passing steps')

    // should sleep 4 times (once for the test, 4 times for the step - upon each test repeat)
    expected = 4
    actual = results.filter(item => item.action === 'sleep').length
    assert.equal(actual, expected, 'should sleep 3 times')

    // test should take between 20 and 25 seconds
    const min = 20
    const max = 25
    actual = (new Date() - start) / 1000

    assert.ok(
      actual >= min && actual <= max,
      'should take between 20 and 25 seconds to finish (actual: ' + actual + ')'
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
