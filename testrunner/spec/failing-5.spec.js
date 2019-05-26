// eslint-disable-next-line
require = require('esm')(module)

const tape = require('tape')
const _promise = require('tape-promise').default
const test = _promise(tape)

const Runner = require('../index').default
const testCase = require('../../tests/dummy/failing-2').default

const reporter = require('../reporters/tdd').default()

test('Failing 4 - stop running steps after failure', assert => {
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
