import Test from './lib/test'
import reporters from './reporters'
import ThunderJS from 'ThunderJS'

export default (testCase, reporter, thunderConfig) => {
  // if reporter not an object, map passed string to default reporter
  if (typeof reporter === 'string') {
    reporter = reporters[reporter]
  }

  const thunderJS = ThunderJS(thunderConfig)

  return new Promise((resolve, reject) => {
    Test(testCase, reporter, thunderJS)
      .exec()
      .then(result => {
        resolve(result)
      })
      .catch(err => {
        reject(err)
      })
  })
}
