import test from 'tape-promise/tape'

import Runner from '../index'
import Reporter from '../reporters/tdd'

import testCase from './setup-teardown-2'

const reporter = Reporter()

test('Setup Teardown 2 - Teardown after failing step', assert => {
  Runner(testCase, reporter).catch(res => {
    // todo ...
    assert.pass('To do ..')
    assert.end()
  })
})
