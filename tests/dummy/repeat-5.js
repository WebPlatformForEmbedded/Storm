const calculateRandomRepeat = max => {
  return Math.floor(Math.random() * max) + 2
}

export default {
  id: 1,
  title: 'Dummy - Repeat - 5',
  description:
    'Testing that we can repeat a test and a step a random nr. of times by passing an function as repeat value',
  repeat: () => {
    const randomRepeats = calculateRandomRepeat(3)
    console.log('Repeating test ' + randomRepeats + ' times')
    // returned as an object
    return {
      times: randomRepeats,
    }
  },
  steps: [
    {
      description: 'Just a basic test step that should run a random amount of times',
      test: x => x,
      params: 1,
      assert: 1,
      repeat: () => {
        const randomRepeats = calculateRandomRepeat(5)
        console.log('Repeating step ' + randomRepeats + ' times')
        // returned as a value
        return randomRepeats
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
