export default {
  title: 'Dummy - Sequence helper',
  description: 'Testing that we can run a sequence of functions with the $sequence helper',
  setup() {
    return this.$sequence([
      () => {
        this.$log('## setup sequence 1')
      },
      () => {
        this.$log('## setup sequence 2')
      },
      () => {
        this.$log('## setup sequence 3')
      },
    ])
  },
  steps: [
    {
      description: 'Running a sequence in a test step',
      test(param) {
        return this.$sequence(
          [
            () => {
              this.$log('## step sequence 1')
            },
            () => {
              this.$log('## step sequence 2')
            },
            () => {
              this.$log('## step sequence 3')
              return param
            },
          ],
          1000
        )
      },
      params: 1,
      assert: 1,
    },
  ],
  teardown() {
    return this.$sequence([
      () => {
        this.$log('## teardown sequence 1')
      },
      () => {
        this.$log('## teardown sequence 2')
      },
      () => {
        this.$log('## teardown sequence 3')
      },
    ])
  },
}
