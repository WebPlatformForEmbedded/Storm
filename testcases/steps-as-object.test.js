export default {
  title: 'Dummy - Steps object',
  description:
    'Testing that steps can also be defined as an object with keys instead of an array (and are executed in the right order)',
  steps: {
    step1: {
      description: 'This is step 1',
      test: x => x,
      params: 1,
      assert: 1,
    },
    step2: {
      description: 'This is step 2',
      test: x => x,
      params: 1,
      assert: 1,
    },
    step3: {
      description: 'This is step 3',
      test: x => x,
      params: 1,
      assert: 1,
    },
    step4: {
      description: 'This is step 4',
      test: x => x,
      params: 1,
      assert: 1,
    },
  },
}
