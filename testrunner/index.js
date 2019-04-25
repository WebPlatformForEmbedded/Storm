import test from './test'
import reporters from './reporters'

export default (testCase, reporter, device) => {
  // if reporter not an object, map passed string to default reporter
  if (typeof reporter === 'string') {
    reporter = reporters[reporter]
  }

  return new Promise((resolve, reject) => {
    test(testCase, reporter, device)
      .exec()
      .then(result => {
        resolve('Done running', result)
      })
      .catch(err => {
        reject(err)
      })
  })
}
