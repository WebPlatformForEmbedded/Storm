import test from 'tape-promise/tape'

import Runner from '../index'
import Reporter from '../reporters/tdd'

import testCase from '../../tests/dummy/nested-tests-1'

const reporter = Reporter()

test('Nested Tests - 1', assert => {
  const start = new Date()

  Runner(testCase, reporter).then(res => {
    const results = reporter.results

    let actual
    let expected

    // should execute the test once
    expected = 1
    actual = results.filter(item => {
      return item.action === 'log' && item.arguments[0].includes('Dummy - Nested tests - 1')
    }).length

    assert.equal(actual, expected, 'should execute the main test once')

    // execute the 2 normal steps once
    expected = 2
    actual = results.filter(item => {
      return (
        item.action === 'log' &&
        (item.arguments[0].includes('This is a normal step') ||
          item.arguments[0].includes(
            'This is second a normal step that should run after all the nested steps'
          ))
      )
    }).length

    assert.equal(actual, expected, 'should execute the 2 normal tests once')

    // should execute the nested test twice
    expected = 2
    actual = results.filter(item => {
      return item.action === 'log' && item.arguments[0].includes('Sub test')
    }).length

    assert.equal(actual, expected, 'should execute the 2 normal tests once')

    // steps of nested test should be executed twice
    expected = 2
    actual = results.filter(item => {
      return (
        item.action === 'log' && item.arguments[0].includes('Executing This is a first nested step')
      )
    }).length

    assert.equal(actual, expected, 'should execute the steps of the nested test upon each repeat')

    // Sub sub test
    expected = 2
    actual = results.filter(item => {
      return item.action === 'log' && item.arguments[0].includes('Executing Sub sub test')
    }).length

    assert.equal(actual, expected, 'should execute sub sub test twice')

    // I am a setup method inside a deeply nested test twice
    expected = 2
    actual = results.filter(item => {
      return (
        item.action === 'log' &&
        item.arguments[0].includes('I am a setup method inside a deeply nested test')
      )
    }).length

    assert.equal(actual, expected, 'should run the setup method of the deeply nested test twice')

    // Sub sub sub test at least 4 times
    let min = 4
    actual = results.filter(item => {
      return item.action === 'log' && item.arguments[0].includes('Sub sub sub test')
    }).length

    assert.ok(actual >= min, 'Sub sub sub test should run at least 4 times (actual ' + actual + ')')

    // test should take at least 12 seconds to finish
    expected = 6 * 2 // repeat for 6 seconds, repeat 2 times
    actual = (new Date() - start) / 1000

    assert.ok(
      actual >= expected,
      'should take at least 12 seconds to finish (actual: ' + actual + ')'
    )

    // test should be a success
    expected = true
    actual = results.map(item => item.action).indexOf('success') > -1
    assert.equal(actual, expected, 'should be successfull')

    // last executed step should be the last step from the main test
    expected = 'Executing This is second a normal step that should run after all the nested steps'
    actual = results
      .filter(item => item.action === 'log')
      .map(item => {
        return item.arguments[0]
      })
      .pop()

    assert.equal(actual, expected, 'last executed step should be the last step from the main test')

    // runner should finish
    expected = true
    actual = results.map(item => item.action).indexOf('finished') > -1
    assert.equal(actual, expected, 'should finish until the end')

    assert.end()
  })
})
