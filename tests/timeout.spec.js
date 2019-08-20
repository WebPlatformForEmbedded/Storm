import test from 'tape-promise/tape'

import Runner from '../src/index'
import Reporter from '../src/reporters/tdd'

import testCase from '../testcases/timeout'

const reporter = Reporter()

test('Timeout', assert => {
  const start = new Date()

  Runner(testCase, reporter)
    .then(res => {})
    .catch(() => {
      const results = reporter.results

      // 1 step should pass
      let expected = 1
      let actual = results.map(item => item.action).filter(item => item === 'pass').length
      assert.equal(actual, expected, 'should have 1 passing step')

      // 1 step should fail
      expected = 1
      actual = results.map(item => item.action).filter(item => item === 'fail').length
      assert.equal(actual, expected, 'should have 1 failing step')

      // test should take at least 10 seconds to finish, but not much more
      let min = 10
      let max = 12
      actual = (new Date() - start) / 1000

      assert.ok(
        actual >= min && actual <= max,
        'should take between 10 and 12 seconds to finish (actual: ' + actual + ')'
      )

      // test should throw an error
      let result = results.filter(item => item.action === 'error')
      expected = 1
      actual = result.length
      assert.equal(actual, expected, 'should have an error')

      expected = 'Max execution time exceeded'
      actual = result[0].arguments[1].message
      assert.equal(actual, expected, 'error message should be `Max execution time exceeded`')

      assert.end()
    })
})
