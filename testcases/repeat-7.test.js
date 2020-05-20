export default {
  title: 'Dummy - Repeat - 7',
  description: 'Testing that a test will sleep for 5 seconds between repetitions',
  sleep: 5,
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
