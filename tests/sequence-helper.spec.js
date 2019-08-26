import test from 'tape-promise/tape'

import Runner from '../src/index'
import Reporter from '../src/reporters/tdd'

import testCase from '../testcases/sequence-helper'

const reporter = Reporter()

test('Sequence helper', assert => {
  Runner(testCase, reporter).then(res => {
    const results = reporter.results
    let expected
    let actual

    // abstract the logs with ##
    const log = results
      .filter(item => {
        return item.action === 'log' && /##/.test(item.arguments[0])
      })
      .map(item => {
        return item.arguments[0].replace('## ', '')
      })

    expected = 9
    actual = log.length
    assert.equal(actual, expected, 'should log 9 items')

    // runner should finish
    expected = true
    actual = results.map(item => item.action).indexOf('finished') > -1
    assert.equal(actual, expected, 'should finish until the end')

    assert.end()
  })
})
