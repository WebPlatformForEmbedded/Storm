import test from 'tape-promise/tape'

import Runner from '../index'
import Reporter from '../reporters/tdd'

import testCase from '../../tests/dummy/extending-5'

const reporter = Reporter()

test('Extending 5 - replacing specific steps using object merge', assert => {
  Runner(testCase, reporter).then(res => {
    const results = reporter.results

    // 4 steps should pass
    let expected = 4
    let actual = results.map(item => item.action).filter(item => item === 'pass').length
    assert.equal(actual, expected, 'should have 4 passing steps')

    // should only call 2 steps from basic
    expected = 2
    actual = results.filter(item => {
      return (
        item.action === 'log' &&
        (item.arguments[0].includes('A synchronous test with a custom validate function') ||
          item.arguments[0].includes('An asynchronous test with a custom validate function'))
      )
    }).length

    assert.equal(actual, expected, 'should call 2 steps from the extended basic test')

    // should call 2 new reusable steps
    expected = 2
    actual = results.filter(item => {
      return (
        item.action === 'log' &&
        (item.arguments[0].includes('A custom test') ||
          item.arguments[0].includes('A reusable step with a random sleep value'))
      )
    }).length

    assert.equal(actual, expected, 'should call 2 new reusable steps')

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
