export default {
  title: 'Dummy - Repeat - 10',
  description:
    'Testing that we can repeat an entire test with different repeating steps for 30 seconds',
  repeat: {
    seconds: 30,
  },
  steps: [
    {
      description: 'Just a basic test step that repeats for 5 seconds',
      test: x => x,
      params: 1,
      assert: 1,
      repeat: {
        seconds: 5,
      },
    },
    {
      description: 'Just another basic test step',
      test: x => x,
      params: 1,
      assert: 1,
      repeat: 5,
    },
  ],
}
