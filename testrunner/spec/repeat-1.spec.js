import test from 'tape-promise/tape'

import Runner from '../index'
import Reporter from '../reporters/tdd'

import testCase from '../../tests/dummy/repeat-1'

const reporter = Reporter()

test('Repeat 1 - steps', assert => {
  const start = new Date()

  Runner(testCase, reporter).catch(() => {
    const results = reporter.results

    // Test that should run 3 times (initial + 2 repeats)
    let expected = 3
    let actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments.length &&
        typeof item.arguments[0] === 'string' &&
        item.arguments[0].includes('Test that should run three times')
      )
    }).length

    assert.equal(actual, expected, 'should have 3 executions of `Test that should run three times`')

    // Test that should run only once
    expected = 1
    actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments.length &&
        typeof item.arguments[0] === 'string' &&
        item.arguments[0].includes('Test that should run only once')
      )
    }).length

    assert.equal(actual, expected, 'should have 1 execution of `Test that should run only once`')

    // Test with asynchronous function (3 second timeout) that should run three times
    expected = 3
    actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments.length &&
        typeof item.arguments[0] === 'string' &&
        item.arguments[0].includes(
          'Test with asynchronous function (3 second timeout) that should run three times'
        )
      )
    }).length

    assert.equal(
      actual,
      expected,
      'should have 3 executions of `Test with asynchronous function (3 second timeout) that should run three times`'
    )

    // test should take at least 6seconds to finish
    expected = 6
    actual = (new Date() - start) / 1000

    assert.ok(
      actual >= expected,
      'should take at least 6 seconds to finish because of 2x3 second timeout (actual: ' +
        actual +
        ')'
    )

    // Test that is intended to run twice, but fails and should run only once
    expected = 1
    actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments.length &&
        typeof item.arguments[0] === 'string' &&
        item.arguments[0].includes(
          'Test that is intended to run twice, but fails and should run only once'
        )
      )
    }).length

    assert.equal(
      actual,
      expected,
      'should have 1 execution of `Test that is intended to run twice, but fails and should run only once`'
    )

    // 1 step should fail
    expected = 1
    actual = results.map(item => item.action).filter(item => item === 'fail').length
    assert.equal(actual, expected, 'should have 1 failing step')

    // test should throw an error
    let result = results.filter(item => item.action === 'error')
    expected = 1
    actual = result.length
    assert.equal(actual, expected, 'should have an error')

    assert.end()
  })
})
