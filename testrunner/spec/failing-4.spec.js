import test from 'tape-promise/tape'

import Runner from '../index'
import Reporter from '../reporters/tdd'

import testCase from '../../tests/dummy/failing-4'

const reporter = Reporter()

test('Failing 4 - asynchronous / validate', assert => {
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

      // test should throw an error
      let result = results.filter(item => item.action === 'error')
      expected = 1
      actual = result.length
      assert.equal(actual, expected, 'should have an error')

      expected = 'Validation failed'
      actual = result[0].arguments[1].message
      assert.equal(actual, expected, 'error message should be `Validation failed`')

      assert.end()
    })
})
