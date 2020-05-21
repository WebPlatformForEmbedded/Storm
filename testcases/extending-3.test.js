import baseTest from './basic.test.js'
import { asyncAssert, repeatTwice, randomSleep } from './extending/reusable-steps.js'

export default {
  ...baseTest,
  ...{
    title: 'Dummy - Extending - 3',
    description: 'Testing that we can reuse steps',
    // replace the steps of the base steps of the base test completely
    steps: [asyncAssert, repeatTwice, randomSleep, repeatTwice, asyncAssert],
  },
}
