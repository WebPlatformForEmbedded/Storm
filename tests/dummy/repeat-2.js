export default {
  id: 1,
  title: 'Dummy - Repeat - 2',
  description: 'Testing if we can repeat an entire test 3 times',
  repeat: 3,
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
