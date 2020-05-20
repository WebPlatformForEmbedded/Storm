export default {
  title: 'Dummy - Data - 2',
  description: 'Testing that data can be initiated in a setup method',
  setup() {
    this.$data.write('bla', 'I was created during setup')
  },
  steps: [
    {
      description: 'Reading data set during setup',
      test() {
        return this.$data.read('bla')
      },
      assert: 'I was created during setup',
    },
  ],
}
