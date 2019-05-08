export default {
  id: 1,
  title: 'Dummy - Repeat - 9',
  description: 'Testing that we can repeat an entire test for 10 seconds',
  repeat: {
    seconds: 10,
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
