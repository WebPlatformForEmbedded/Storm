export default {
  title: 'Dummy - Nested tests - 2',
  description: 'Testing that we read context in nested tests',
  context: {
    parent: 'this is some parent context',
  },
  steps: [
    {
      description: 'This is a normal step',
      test() {
        return this.$context.read('parent')
      },
      validate(val) {
        return val === 'this is some parent context'
      },
    },
    {
      title: 'This is a sub test',
      decription: 'Testing that we can read context from parent',
      steps: [
        {
          description: 'Read parent context',
          test() {
            return this.$context.read('parent')
          },
          validate(val) {
            return val === 'this is some parent context'
          },
        },
      ],
    },
    {
      title: 'This is another sub test',
      decription: 'Testing that we can read context from parent and define child context',
      context: {
        child: 'this is some child context',
      },
      steps: [
        {
          description: 'Read parent and child context',
          test() {
            return this.$context.read('parent') + ' ' + this.$context.read('child')
          },
          validate(val) {
            return val === 'this is some parent context this is some child context'
          },
        },
      ],
    },
    {
      title: 'This is a third sub test',
      decription: 'Testing that child context supercedes parent context',
      context: {
        parent: 'this is some changed parent context',
      },
      steps: [
        {
          description: 'Read child context (overwritten parent)',
          test() {
            return this.$context.read('parent')
          },
          validate(val) {
            return val === 'this is some changed parent context'
          },
        },
      ],
    },
    {
      title: 'This is a fourth sub test',
      decription: 'Testing that context from a previous step is not mixed into a next step',
      steps: [
        {
          description: 'Read context from previous step',
          test() {
            return this.$context.read('child')
          },
          validate(val) {
            return val === null
          },
        },
      ],
    },
    {
      title: 'This is fifth sub test',
      decription: 'Testing that context from 2 parents can be read in a deep nested test',
      context: {
        sub: 'I am sub context',
      },
      steps: [
        {
          title: 'This is a deep nested test',
          description: 'Testing that context from 2 parents can be read in a deep nested test',
          context: {
            subsub: 'I am sub sub context',
          },
          steps: [
            {
              test() {
                return [
                  this.$context.read('parent'),
                  this.$context.read('sub'),
                  this.$context.read('subsub'),
                ].join(' ')
              },
              validate(val) {
                return (
                  val ===
                  ['this is some parent context', 'I am sub context', 'I am sub sub context'].join(
                    ' '
                  )
                )
              },
            },
          ],
        },
      ],
    },
  ],
}
