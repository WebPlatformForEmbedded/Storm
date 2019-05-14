export default {
  steps: {
    step1: {
      id: 1,
      description: 'A synchronous test with assert',
      test: x => x,
      params: 1,
      assert: 1,
    },
    step2: {
      id: 2,
      description: 'A synchronous test with a custom validate function',
      test: x => x,
      params: 1,
      validate: x => x === x,
    },
    step3: {
      id: 3,
      description: 'An asynchronous test with assert',
      test: async x => x,
      params: 1,
      assert: 1,
    },
    step4: {
      id: 4,
      description: 'An asynchronous test with a custom validate function',
      test: async x => x,
      params: 1,
      validate: x => x === x,
    },
  },
}
