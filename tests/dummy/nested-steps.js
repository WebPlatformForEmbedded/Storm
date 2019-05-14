export default {
  title: 'Dummy - Nested steps',
  description: 'Testing that we can nest steps',
  steps: [
    {
      description: 'This is a normal step',
      test: x => x,
      params: 1,
      assert: 1,
    },
    {
      description: 'These are some nested steps',
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
          description: 'These are some nested-nested steps',
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
              description: 'Going a level deeper!',
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
