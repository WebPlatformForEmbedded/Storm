export default {
  id: 1,
  title: 'Dummy - Repeat - 4',
  description:
    'Testing that we can run a test twice and run a step 3 times by passing an object as repeat value (and use it to potentially configure repeat better)',
  repeat: {
    times: 2,
  },
  steps: [
    {
      description: 'Just a basic test step that should run 3 times',
      test: x => x,
      params: 1,
      assert: 1,
      repeat: {
        times: 3,
      },
    },
    {
      description: 'Just another basic test step',
      test: x => x,
      params: 1,
      assert: 1,
    },
  ],
}
