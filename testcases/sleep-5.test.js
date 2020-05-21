export default {
  title: 'Dummy - Sleep - 5',
  description: 'Testing sleepOnce functionality',
  sleepOnce: 5,
  repeat: 2,
  steps: [
    {
      description: 'A repeating step with sleepOnce',
      sleepOnce: 5,
      test: x => x,
      repeat: 2,
      params: 1,
      assert: 1,
    },
  ],
}
