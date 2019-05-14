export const asyncAssert = {
  description: 'A synchronous test with assert',
  test: x => x,
  params: 1,
  assert: 1,
}

export const repeatTwice = {
  description: 'Test that should run twice',
  test: x => x,
  params: 1,
  assert: 1,
  repeat: 2,
}

export const randomSleep = {
  description: 'A test with a random sleep value',
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
