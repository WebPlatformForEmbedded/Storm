export default {
  id: 1,
  title: 'Dummy - Repeat - 8',
  description: 'Testing that we can repeat a test step for 10 seconds',
  steps: [
    {
      description: 'Just a basic test step that should be repeated for 10 seconds',
      test: x => x,
      params: 1,
      assert: 1,
      repeat: {
        seconds: 10,
      },
    },
    {
      description: 'Just another basic test step to run after the repeat',
      test: x => x,
      params: 1,
      assert: 1,
    },
  ],
}
