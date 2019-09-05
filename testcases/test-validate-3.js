export default {
  title: 'Dummy - Test validate - 3',
  description: 'Testing that a final test validate can use data set in steps',
  setup() {
    this.$data.write('cpu_loads', [])
  },
  steps: [
    {
      description: 'Just a simple test step',
      test(params) {
        const cpu_loads = this.$data.read('cpu_loads')
        cpu_loads.push(100)
        this.$data.write('cpu_loads', cpu_loads)
        return params
      },
      params: 1,
      assert: 1,
    },
    {
      description: 'Another simple test step',
      test(params) {
        const cpu_loads = this.$data.read('cpu_loads')
        cpu_loads.push(80)
        this.$data.write('cpu_loads', cpu_loads)
        return params
      },
      params: 2,
      assert: 2,
    },
    {
      description: 'And the last simple test step',
      test(params) {
        const cpu_loads = this.$data.read('cpu_loads')
        cpu_loads.push(90)
        this.$data.write('cpu_loads', cpu_loads)
        return params
      },
      params: 3,
      assert: 3,
    },
  ],
  validate() {
    // calculate avg cpu during the steps
    const cpu_avg = this.$data.read('cpu_loads').reduce((sum, load, index, ar) => {
      return index < ar.length - 1 ? sum + load : (sum + load) / ar.length
    }, 0)
    // average cpu can not be higher 90
    return cpu_avg <= 90
  },
}
