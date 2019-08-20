import test from 'tape-promise/tape'

import Runner from '../src/index'
import Reporter from '../src/reporters/tdd'

import testCase from '../testcases/setup-teardown-3'

const reporter = Reporter()

test('Setup Teardown 3 - not functions', assert => {
  Runner(testCase, reporter).then(res => {
    const results = reporter.results

    // 1 step should pass
    let expected = 1
    let actual = results.map(item => item.action).filter(item => item === 'pass').length
    assert.equal(actual, expected, 'should have 1 passing step')

    // should not call the setup method
    actual =
      results.filter(item => {
        return item.arguments && item.arguments[0] === 'Running Test Setup'
      }).length === 0
    assert.ok(actual, 'should not call setup method')

    // should not call the teardown method
    actual =
      results.filter(item => {
        return item.arguments && item.arguments[0] === 'Running Test Teardown'
      }).length === 0
    assert.ok(actual, 'should not call teardown method')

    assert.end()
  })
})
