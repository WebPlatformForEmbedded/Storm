const avg = items => {
  return items.reduce((sum, load, index, ar) => {
    return index < ar.length - 1 ? sum + load : (sum + load) / ar.length
  }, 0)
}

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default {
  title: 'Dummy - Repeat - 11',
  description: 'Testing that we can repeat a step until a certain condition is met',
  setup() {
    this.$data.store('cpu_loads', [])
    this.$data.store('step_count', 0)
  },
  repeat: {
    until() {
      const step_count = this.$data.read('step_count')
      this.$log('Total step count ' + step_count)
      // repeat the entire test until we have at least 30 step repetitions
      return step_count >= 30
    },
  },
  steps: [
    {
      description: 'Just a basic test step that repeats until a condition is met',
      test(x) {
        const cpu_loads = this.$data.read('cpu_loads')
        // simulate cpu load between 50 and 100
        cpu_loads.push(randomInt(50, 100))
        this.$data.store('cpu_loads', cpu_loads)

        // ioncrement step count
        this.$data.store('step_count', this.$data.read('step_count') + 1)

        return x
      },
      params: 1,
      assert: 1,
      repeat: {
        until() {
          const avg_cpu_load = avg(this.$data.read('cpu_loads'))
          this.$log('Average CPU load ' + avg_cpu_load)
          // repeat until average cpu load is 75 or higher
          return avg_cpu_load >= 75
        },
      },
    },
    {
      description: 'Just another basic test step',
      test: x => x,
      params: 1,
      assert: 1,
    },
  ],
}
