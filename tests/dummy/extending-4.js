import baseTest from './basic.js'
import { randomSleep } from './extending/reusable-steps.js'

export default {
  title: 'Dummy - Extending - 4',
  description: 'Testing that we can manually replace 2 specific steps in the base test',
  // replace the steps of the base steps of the base test with another one
  steps: baseTest.steps.map((step, index) => {
    // first step should become a custom test step
    if (index === 0) {
      return {
        description: 'A custom test',
        test: x => x,
        params: 1,
        assert: 1,
      }
    }
    // third test step should become an imported reusable step
    if (index === 2) {
      return randomSleep
    }
    // rest of the steps remain the same
    return step
  }),
}
