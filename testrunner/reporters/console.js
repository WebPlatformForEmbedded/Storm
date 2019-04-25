export default {
  init(name) {
    console.log('🚀  Starting test `' + name + '`')
  },
  step(description) {
    console.log('🚀  Starting step `' + description + '`')
  },
  log(msg) {
    console.log('➡️  ' + msg)
  },
  pass(description) {
    console.log('✅  Step `' + description + '` passed')
  },
  fail(description, err) {
    console.log('❌  Step  `' + description + '` failed', err)
  },
  success() {
    console.log('👍  Success')
  },
  error() {
    console.log('😭  Error')
  },
}
