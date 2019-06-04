const incrementCount = (dataObj, key) => {
  dataObj.store(key, dataObj.read(key) + 1)
}
export default {
  title: 'Dummy - Nested tests - 3',
  description: 'Testing that we read and store data in nested tests',
  setup() {
    this.$data.store('stepcount', 0)
  },
  steps: [
    {
      description: 'Step that sets some data',
      test() {
        incrementCount(this.$data, 'stepcount')
        this.$data.store('hello', 'Hello from first step of parent test')
        return true
      },
      assert: true,
    },
    {
      title: 'This is a sub test',
      decription: 'Testing that we can read data defined in parent',
      steps: [
        {
          description: 'Read parent data',
          test() {
            incrementCount(this.$data, 'stepcount')
            return this.$data.read('hello')
          },
          validate(val) {
            return val === 'Hello from first step of parent test'
          },
        },
        {
          description: 'Store some data in sub test',
          test() {
            incrementCount(this.$data, 'stepcount')
            this.$data.store('hi', 'Hi from second step of sub test')
            return this.$data.read('hi')
          },
          assert: 'Hi from second step of sub test',
        },
        {
          title: 'This is a sub sub test',
          description: 'Reading ans setting data in sub sub test',
          steps: [
            {
              description: 'Reading data from parent tests',
              test() {
                incrementCount(this.$data, 'stepcount')
                return this.$data.read('hello') + ' ' + this.$data.read('hi')
              },
              assert:
                'Hello from first step of parent test' + ' ' + 'Hi from second step of sub test',
            },
            {
              description: 'Setting data in sub sub test',
              test() {
                incrementCount(this.$data, 'stepcount')
                this.$data.store('bye', 'Bye from second step of sub sub test')
                return this.$data.read('bye')
              },
              assert: 'Bye from second step of sub sub test',
            },
          ],
        },
      ],
    },
    {
      description: 'Step that reads data set in sub and sub sub test',
      test() {
        incrementCount(this.$data, 'stepcount')
        return this.$data.read('hi') + ' ' + this.$data.read('bye')
      },
      assert: 'Hi from second step of sub test Bye from second step of sub sub test',
    },
  ],
  validate() {
    // Verify that step count was incremented succesfully
    return this.$data.read('stepcount') === 6
  },
}
