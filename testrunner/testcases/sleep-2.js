export default {
  title: 'Dummy - Sleep - 2',
  description: 'Testing sleeping for 5 seconds before starting a test',
  sleep: 5,
  steps: [
    {
      description: 'Just a basic test step',
      test: x => x,
      params: 1,
      assert: 1,
    },
  ],
}
