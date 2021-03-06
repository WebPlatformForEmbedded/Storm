import test from 'tape-promise/tape'

import Runner from '../src/index'
import Reporter from '../src/reporters/tdd'

import testCase from '../testcases/error-2'

const reporter = Reporter()

test('Error 2 - error in validation function', assert => {
  Runner(testCase, reporter)
    .then(res => {
      console.log('the result', res)
    })
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

      expected = 'y is not defined'
      actual = result[0].arguments[1].message
      assert.equal(actual, expected, 'error message should be `y is not defined`')

      assert.end()
    })
})
