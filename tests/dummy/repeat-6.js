export default {
  id: 1,
  title: 'Dummy - Repeat - 6',
  description: 'Testing that setup and teardown can be configured to run on each repeat of a test',
  repeat: {
    times: 2,
    setup: true, // defaults to false
    teardown: true, // defaults to false
  },
  setup: () => {
    console.log('I am a Setup method. I should run before the steps, and on every repeat')
  },
  teardown: () => {
    console.log('I am a Teardown method. I should run after the steps, and on every repeat')
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
