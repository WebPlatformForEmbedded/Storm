import Runner from '../../../testrunner'
import reporter from './reporter'
import Tests from '../../../tests'

self.addEventListener('message', e => {
  if (e.data.action === 'start') {
    const test = Tests.filter(t => {
      return t.title === e.data.testName
    }).shift()

    if (test) {
      Runner(test, reporter(self), e.data.device)
    } else {
      console.log('no test found')
    }
  }
})
