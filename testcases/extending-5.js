import baseTest from './extending/base-test.js' // note: this baseTest uses object with keys to define steps!
import { randomSleep } from './extending/reusable-steps.js'

export default {
  title: 'Dummy - Extending - 5',
  description:
    'Testing that we can automatically replace specific steps when object notation for the steps',
  steps: {
    ...baseTest.steps,
    ...{
      // define key 'step1' with a custom test
      step1: {
        description: 'A custom test!',
        test: x => x,
        params: 1,
        assert: 1,
      },
      // define key 'step3' with an imported reusable step
      step3: randomSleep,
    },
  },
}
