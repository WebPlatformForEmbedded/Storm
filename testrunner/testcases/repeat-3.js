export default {
  title: 'Dummy - Repeat - 3',
  description:
    'Testing that setup and teardown are run only 1 by default when repeating an entire test',
  repeat: 3,
  setup() {
    this.$log('I am a Setup method. I should run before the steps, but only once')
  },
  teardown() {
    this.$log(
      'I am a Teardown method. I should run after the steps, but only once and on the last test repetition'
    )
  },
  steps: [
    {
      description: 'Just a basic test step',
      test: x => x,
      params: 1,
      assert: 1,
    },
    {
      description: 'Just another basic test step',
      test: x => x,
      params: 1,
      assert: 1,
    },
  ],
}
