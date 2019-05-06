export default {
  title: 'Dummy - Sleep - 2',
  description:
    'Testing sleeping for random amount of seconds (function based) before starting a test',
  sleep: () => {
    return Math.floor(Math.random() * 10) + 1
  },
  steps: [
    {
      description: 'Just a basic test step',
      test: x => x,
      params: 1,
      assert: 1,
    },
  ],
}
