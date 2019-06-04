import test from 'tape-promise/tape'

import Runner from '../index'
import Reporter from '../reporters/tdd'

import testCase from './moment'

const reporter = Reporter()

test('Moment test', assert => {
  Runner(testCase, reporter).then(res => {
    const results = reporter.results
    let expected
    let actual

    // log the year from setup
    actual = results.findIndex(item => {
      return item.action === 'log' && item.arguments[0] === 'The year is: 2001'
    })

    assert.ok(actual > -1, 'should log `The year is: 2001` from the setup method')

    // log the month from teardown
    actual = results.findIndex(item => {
      return item.action === 'log' && item.arguments[0] === 'The month is: 06'
    })

    assert.ok(actual > -1, 'should log `The month is: 06` from the teardown method')

    // log the date from step test
    actual = results.findIndex(item => {
      return item.action === 'log' && item.arguments[0] === 'The date is: 01'
    })

    assert.ok(actual > -1, 'should log `The date is: 01` from the step test method')

    // log the hour from step validate
    actual = results.findIndex(item => {
      return item.action === 'log' && item.arguments[0] === 'The hour is: 12'
    })

    assert.ok(actual > -1, 'should log `The hour is: 12` from the step validate method')

    // log the minute from test validate
    actual = results.findIndex(item => {
      return item.action === 'log' && item.arguments[0] === 'The minute is: 30'
    })

    assert.ok(actual > -1, 'should log `The minute is: 30` from the test validate method')

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
