export default {
  title: 'Dummy - Sleep',
  description: 'Testing sleeping between test steps',
  steps: [
    {
      description: 'A test without sleep should be executed immediately',
      test: x => x,
      params: 1,
      assert: 1,
    },
    {
      description: 'A test with sleep value 2 should be executed with 2 seconds delay',
      test: x => x,
      sleep: 2,
      params: 1,
      assert: 1,
    },
    {
      description: 'A test with a decimal sleep value (2.5) should be executed with a delay',
      test: x => x,
      sleep: 2.5,
      params: 1,
      assert: 1,
    },
    {
      description: 'A test with an non numeric sleep value (`bla`) should be executed immediately',
      test: x => x,
      sleep: 'bla',
      params: 1,
      assert: 1,
    },
    {
      description:
        'A test with a numeric sleep value disguised as string (`5`) should not be executed immediately',
      test: x => x,
      sleep: '5',
      params: 1,
      assert: 1,
    },
    {
      description:
        'A test sleep value with a function (that returns a number) should be executed with a delay (at the next minute change)',
      test: x => x,
      sleep: () => {
        const date = new Date()
        const secondsToNextMinute = 60 - date.getSeconds()
        return secondsToNextMinute
      },
      params: 1,
      assert: 1,
    },
    {
      description:
        'A test sleep value with a function (that does not return a number) should be executed immediately',
      test: x => x,
      sleep: () => {
        return 'lorem ipsum'
      },
      params: 1,
      assert: 1,
    },
    {
      description:
        'A test sleep value with a function (that returns a number as a string) should be executed with delay',
      test: x => x,
      sleep: () => {
        return '4'
      },
      params: 1,
      assert: 1,
    },
  ],
}
