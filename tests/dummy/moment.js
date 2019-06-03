let now = new Date(2001, 5, 1, 12, 30)

export default {
  title: 'Dummy - Moment',
  description: 'Testing that we can use the moment library in the tests',
  setup() {
    this.$log('The year is: ' + this.$moment(now).format('YYYY'))
  },
  teardown() {
    this.$log('The month is: ' + this.$moment(now).format('MM'))
  },
  steps: [
    {
      description: 'Calling the moment library from a step test',
      test() {
        this.$log('The date is: ' + this.$moment(now).format('DD'))
        return 1
      },
      assert: 1,
    },
    {
      description: 'Calling the moment library from a step validate',
      test() {
        return 1
      },
      validate() {
        this.$log('The hour is: ' + this.$moment(now).format('hh'))
        return true
      },
    },
  ],
  validate() {
    this.$log('The minute is: ' + this.$moment(now).format('mm'))
    return true
  },
}
