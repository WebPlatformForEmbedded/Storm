import test from 'tape-promise/tape'

import Runner from '../src/index'
import Reporter from '../src/reporters/tdd'

import testCase from '../testcases/error-1'

const reporter = Reporter()

test('Error 1 - error in test function', assert => {
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

      // todo: should have a more clear error message
      expected = 'foo is not defined'
      actual = result[0].arguments[1].message
      assert.equal(actual, expected, 'error message should be `foo is not defined`')

      assert.end()
    })
})
