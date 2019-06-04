import test from 'tape-promise/tape'

import Runner from '../index'
import Reporter from '../reporters/tdd'

import testCase from './sleep-2'

const reporter = Reporter()

test('Sleep 2 - test', assert => {
  const start = new Date()

  Runner(testCase, reporter).then(res => {
    const results = reporter.results

    // 1 steps should pass
    let expected = 1
    let actual = results.map(item => item.action).filter(item => item === 'pass').length
    assert.equal(actual, expected, 'should have 1 passing step')

    // 1 sleep log
    expected = 1
    actual = results.filter(item => item.action === 'sleep').length
    assert.equal(actual, expected, 'should have 1 log of sleep')

    // reported sleep should be 5 seconds
    expected = 5
    actual =
      results
        .filter(item => item.action === 'sleep')
        .reduce((total, item) => {
          return total + item.arguments[0]
        }, 0) / 1000

    assert.equal(actual, expected, 'should report a total of 5 seconds of sleep')

    // test should take at least 5 seconds to finish
    expected = 5
    actual = (new Date() - start) / 1000

    assert.ok(actual >= actual, 'should take at least 5 seconds to finish (actual: ' + actual + ')')

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
