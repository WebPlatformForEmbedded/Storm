export const asyncAssert = {
  description: 'A reusable synchronous test with assert',
  test: x => x,
  params: 1,
  assert: 1,
}

export const repeatTwice = {
  description: 'Reusable step that should run twice',
  test: x => x,
  params: 1,
  assert: 1,
  repeat: 2,
}

export const randomSleep = {
  description: 'A reusable step with a random sleep value',
  test: x => x,
  sleep: () => {
    return Math.floor(Math.random() * 10) + 1
  },
  params: 1,
  assert: 1,
}

export default {
  asyncAssert,
  repeatTwice,
  randomSleep,
}
