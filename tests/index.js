export default [
  require('./dummy/basic.js').default,
  require('./dummy/failing-1.js').default,
  require('./dummy/failing-2.js').default,
  require('./dummy/failing-3.js').default,
  require('./dummy/failing-4.js').default,
  require('./dummy/sleep.js').default,
  require('./dummy/error-1.js').default,
  require('./dummy/error-2.js').default,

  // require('./dummy.test.js').default,
  // require('./helpers.test.js').default,
  // require('./youtube.test.js').default,
  // require('./timeout-requests.test.js').default,
  // require('./timeout-custom.test.js').default,
]
