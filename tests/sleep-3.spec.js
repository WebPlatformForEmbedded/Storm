import test from 'tape-promise/tape'

import Runner from '../src/index'
import Reporter from '../src/reporters/tdd'

import testCase from '../testcases/sleep-3'

for (let i = 0; i < 5; i++) {
  const reporter = Reporter()

  test('Sleep 3 - random sleep (function) test (' + (i + 1) + '/5)', assert => {
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

      // reported sleep should be between 1 and 10 seconds
      let min = 1
      let max = 10
      actual =
        results
          .filter(item => item.action === 'sleep')
          .reduce((total, item) => {
            return total + item.arguments[0]
          }, 0) / 1000

      assert.ok(actual >= min && actual <= max, 'should report between 1 and 10 seconds of sleep')

      // test should take at least x seconds to finish
      expected = actual // take seconds from previous calculation
      actual = (new Date() - start) / 1000

      assert.ok(
        actual >= actual,
        'should take between 1 and 10 seconds to finish (actual: ' + actual + ')'
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
}
