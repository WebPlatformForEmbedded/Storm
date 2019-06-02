import test from 'tape-promise/tape'

import Runner from '../index'
import Reporter from '../reporters/tdd'

import testCase from '../../tests/dummy/extending-3'

const reporter = Reporter()

test('Extending 3 - replacing steps with reusable steps', assert => {
  Runner(testCase, reporter).then(res => {
    const results = reporter.results

    // 7 steps should pass
    let expected = 9 // 2 repeat twice steps
    let actual = results.map(item => item.action).filter(item => item === 'pass').length
    assert.equal(actual, expected, 'should have 7 passing steps (replaced 4 steps from from basic)')

    // should not call any of the steps from basic
    expected = 0
    actual = results.filter(item => {
      return (
        item.action === 'log' &&
        (item.arguments[0].includes('A synchronous test with assert') ||
          item.arguments[0].includes('A synchronous test with a custom validate function') ||
          item.arguments[0].includes('An asynchronous test with assert') ||
          item.arguments[0].includes('An asynchronous test with a custom validate function'))
      )
    }).length

    assert.equal(actual, expected, 'should not call any of the steps from the extended basic test')

    // should  call all of the new reusable steps
    expected = 9
    actual = results.filter(item => {
      return (
        item.action === 'log' &&
        (item.arguments[0].includes('A reusable synchronous test with assert') ||
          item.arguments[0].includes('Reusable step that should run twice') ||
          item.arguments[0].includes('A reusable step with a random sleep value'))
      )
    }).length

    assert.equal(actual, expected, 'should call all the new reusable steps')

    // test should be a success
    expected = true
    actual = results.map(item => item.action).indexOf('success') > -1
    assert.equal(actual, expected, 'should be successfull')

    // runner should finish
    expected = true
    actual = results.map(item => item.action).indexOf('finished') > -1
    assert.equal(actual, expected, 'should finish until the end')

    assert.end()
  })
})
