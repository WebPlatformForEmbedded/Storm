import test from 'tape-promise/tape'

import Runner from '../src/index'
import Reporter from '../src/reporters/tdd'

import testCase from '../testcases/repeat-9'

const reporter = Reporter()

test('Repeat 9 - test time based', assert => {
  const start = new Date()

  Runner(testCase, reporter).then(() => {
    const results = reporter.results

    let expected
    let actual

    // Dummy - Repeat - 9 - more than once
    let testRepeats = (actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments.length &&
        typeof item.arguments[0] === 'string' &&
        item.arguments[0].includes('Dummy - Repeat - 9')
      )
    }).length)

    assert.ok(
      actual > 1,
      'should have more than 1 execution of `Dummy - Repeat - 9` (' + testRepeats + ')'
    )

    // Just a basic test step shoud be repeated once for each test repeat
    expected = testRepeats
    actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments.length &&
        typeof item.arguments[0] === 'string' &&
        item.arguments[0].includes('Just a basic test step')
      )
    }).length

    assert.equals(
      expected,
      actual,
      'should execute `Just a basic test step` once for each test repeat (' + testRepeats + ')'
    )

    // Just another basic test step shoud be repeated once for each test repeat
    expected = testRepeats
    actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments.length &&
        typeof item.arguments[0] === 'string' &&
        item.arguments[0].includes('Just another basic test step')
      )
    }).length

    assert.equals(
      expected,
      actual,
      'should execute `Just another basic test step` once for each test repeat (' +
        testRepeats +
        ')'
    )

    // Test should take at least 10 seconds to finish
    expected = 10
    actual = (new Date() - start) / 1000

    assert.ok(
      actual >= expected,
      'should take at least 10 seconds to finish (actual: ' + actual + ')'
    )

    assert.end()
  })
})
