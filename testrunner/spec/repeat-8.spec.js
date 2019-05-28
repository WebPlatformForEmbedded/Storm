import test from 'tape-promise/tape'

import Runner from '../index'
import Reporter from '../reporters/tdd'

import testCase from '../../tests/dummy/repeat-8'

const reporter = Reporter()

test('Repeat 8 - step time based', assert => {
  const start = new Date()

  Runner(testCase, reporter).then(() => {
    const results = reporter.results

    let expected = 1
    let actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments.length &&
        typeof item.arguments[0] === 'string' &&
        item.arguments[0].includes('Dummy - Repeat - 8')
      )
    }).length

    assert.equal(actual, expected, 'should have 1 execution of `Dummy - Repeat - 8`')

    // Just a basic test step that should be repeated for 10 seconds - more than once
    actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments.length &&
        typeof item.arguments[0] === 'string' &&
        item.arguments[0].includes('Just a basic test step that should be repeated for 10 seconds')
      )
    }).length

    assert.ok(
      actual > 1,
      'should have more than 1 execution of `Just a basic test step that should be repeated for 10 seconds` (actual ' +
        actual +
        ') '
    )

    // Just another basic test step to run after the repeat - once
    expected = 1
    actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments.length &&
        typeof item.arguments[0] === 'string' &&
        item.arguments[0].includes('Just another basic test step to run after the repeat')
      )
    }).length

    assert.equal(
      expected,
      actual,
      'should have only 1 execution of `Just another basic test step to run after the repeat`'
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
