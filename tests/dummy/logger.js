export default {
  id: 1,
  title: 'Dummy - Logger - 1',
  description: 'Testing that you can send custom log messages to the reporter',
  setup() {
    this.$log('Hey! I am a setup method!')
  },
  teardown() {
    this.$log('Hey! I am a teardown method!')
  },
  steps: [
    {
      description: 'Calling the log method from a test step',
      test() {
        this.$log('Hey! This is a custom log message in a test step!')
        return 1
      },
      assert: 1,
    },
    {
      description: 'Calling the log method from a step validation',
      test() {
        return 1
      },
      validate() {
        this.$log('Hey! This is a custom log message in a step validation!')
        return true
      },
    },
  ],
  validate() {
    this.$log('Hey! This is a custom log message in a test validation!')
    return true
  },
}
