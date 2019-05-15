export default {
  title: 'Dummy - Nested tests - 1',
  description: 'Testing that we can nest test',
  steps: [
    {
      description: 'This is a normal step',
      test: x => x,
      params: 1,
      assert: 1,
    },
    {
      title: 'Sub test',
      description: 'This is a nested test that should be repeated 2 times',
      sleep: 4,
      repeat: 2,
      steps: [
        {
          description: 'This is a first nested step',
          test: x => x,
          params: 1,
          assert: 1,
        },
        {
          description: 'This is a second nested step',
          test: x => x,
          params: 1,
          assert: 1,
        },
        {
          title: 'Sub sub test',
          description: 'This is a nested-nested test',
          steps: [
            {
              description: 'This is a first nested-nested step',
              test: x => x,
              params: 1,
              assert: 1,
            },
            {
              description: 'This is a second nested-nested step',
              test: x => x,
              params: 1,
              assert: 1,
            },
            {
              title: 'Sub sub sub test',
              description: 'A deeply nested test that should repeat for 5 seconds',
              sleep: 2,
              setup() {
                this.$log('I am a setup method inside a deeply nested test')
              },
              repeat: {
                seconds: 5,
              },
              steps: [
                {
                  description: 'This is a first deep nested step',
                  test: x => x,
                  params: 1,
                  assert: 1,
                },
                {
                  description: 'This is a second deep nested step',
                  test: x => x,
                  params: 1,
                  assert: 1,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      description: 'This is second a normal step that should run after all the nested steps',
      test: x => x,
      params: 1,
      assert: 1,
    },
  ],
}
