import baseTest from './basic.test.js'

export default {
  ...baseTest,
  ...{
    title: 'Dummy - Extending - 2',
    description:
      'Testing that we can extend a test with a base test and add a custom setup and teardown',
    setup() {
      this.$log('I am a setup method, that did not exist in the base test')
    },
    teardown() {
      this.$log('I am a teardown method, that did not exist in the base test')
    },
    // note this test still doesn't have any steps of it's own
  },
}
