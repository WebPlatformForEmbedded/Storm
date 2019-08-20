import test from 'tape-promise/tape'

import Runner from '../src/index'
import Reporter from '../src/reporters/tdd'

import testCase from '../testcases/setup-teardown-4'

const reporter = Reporter()

test('Setup Teardown 4 - Asynchronous', assert => {
  const start = new Date()

  Runner(testCase, reporter).then(res => {
    const results = reporter.results

    // should run the setup method first
    let expected = { action: 'log', arguments: ['Running Test Setup'] }
    let actual = results[2]
    assert.deepEqual(actual, expected, 'should run the setup method first')

    // 1 step should pass
    expected = 1
    actual = results.map(item => item.action).filter(item => item === 'pass').length
    assert.equal(actual, expected, 'should have 1 passing steps')

    // test should be a success
    expected = true
    actual = results.map(item => item.action).indexOf('success') > -1
    assert.equal(actual, expected, 'should be successfull')

    // should run the teardown method last
    expected = { action: 'log', arguments: ['Running Test Teardown'] }
    actual = results[7]
    assert.deepEqual(actual, expected, 'should run the teardown method last')

    // test should take at least 6 seconds to finish
    expected = 6
    actual = (new Date() - start) / 1000

    assert.ok(
      actual >= expected,
      'should take at least 6 seconds to finish (actual: ' + actual + ')'
    )

    // runner should finish
    expected = true
    actual = results.map(item => item.action).indexOf('finished') > -1
    assert.equal(actual, expected, 'should finish until the end')

    assert.end()
  })
})
