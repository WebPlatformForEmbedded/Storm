// eslint-disable-next-line
require = require('esm')(module)

const tape = require('tape')
const _promise = require('tape-promise').default
const test = _promise(tape)

const Runner = require('../index').default
const testCase = require('../../tests/dummy/basic').default

const reporter = require('../reporters/tdd').default()

test('Basic test', assert => {
  Runner(testCase, reporter).then(res => {
    const results = reporter.results

    // 4 steps should pass
    let expected = 4
    let actual = results.map(item => item.action).filter(item => item === 'pass').length
    assert.equal(actual, expected, 'should have 4 passing steps')

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

// Runner(Tests[0], 'console')
//   .then(() => {})
//   .catch(() => {})
