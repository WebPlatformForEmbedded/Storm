export default {
  init(test) {
    console.log('🚀  Starting test `' + test.title + '`')
  },
  step(test, step) {
    console.log('🚀  Starting step `' + step.description + '`')
  },
  log() {
    console.log.apply(null, ['➡️  ', ...arguments])
  },
  sleep(milliseconds) {
    console.log('😴  Sleeping for ' + milliseconds / 1000 + ' seconds')
  },
  pass(test, step) {
    console.log('✅  Step `' + step.description + '` passed')
  },
  fail(test, step, err) {
    console.log('❌  Step  `' + step.description + '` failed', err)
  },
  success(test) {
    console.log('👍  Success ' + test.title)
  },
  error(test, err) {
    console.log('😭  Error ' + test.title, err)
  },
  finished(test) {
    console.log('🏁  Test ' + test.title + ' finished running')
  },
}
