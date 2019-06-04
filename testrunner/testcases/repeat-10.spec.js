import test from 'tape-promise/tape'

import Runner from '../index'
import Reporter from '../reporters/tdd'

import testCase from './repeat-10'

const reporter = Reporter()

test('Repeat 10 - mixed', assert => {
  let start = new Date()
  Runner(testCase, reporter).then(() => {
    const results = reporter.results

    let expected
    let actual

    // Should have multiple repeats of the test
    let nrTests = (actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments.length &&
        typeof item.arguments[0] === 'string' &&
        item.arguments[0].includes('Dummy - Repeat - 10')
      )
    }).length)

    assert.ok(
      actual > 1,
      'should have more than 1 execution of `Dummy - Repeat - 10` (actual ' + actual + ')'
    )

    // repeats of Just a basic test step that repeats for 5 seconds
    let min = nrTests * 9
    let max = nrTests * 11
    actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments.length &&
        typeof item.arguments[0] === 'string' &&
        item.arguments[0].includes('Just a basic test step that repeats for 5 seconds')
      )
    }).length

    assert.ok(
      actual >= min && actual <= max,
      'should have multiple repeats of `Just a basic test step that repeats for 5 seconds` (actual ' +
        actual +
        ' )'
    )

    // repeats of Just another basic test step
    expected = nrTests * 6
    actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments.length &&
        typeof item.arguments[0] === 'string' &&
        item.arguments[0].includes('Just another basic test step')
      )
    }).length

    assert.equal(
      actual,
      expected,
      'should have multiple repeats of `Just another basic test step` (actual ' + actual + ' )'
    )

    assert.ok(
      actual % 6 === 0,
      'repeats of `Just another basic test step` should be a factor of 6 (1 execution + 5 repeats)'
    )

    // test should take 30 seconds (but not much more)
    min = 30
    max = 35
    actual = (new Date() - start) / 1000

    assert.ok(
      actual >= min && actual <= max,
      'should take 30 seconds, but not much more (actual: ' + actual + ')'
    )

    assert.end()
  })
})
