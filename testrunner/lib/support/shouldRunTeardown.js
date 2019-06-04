import getNrRepeats from './getNrRepeats'

const shouldRunTeardown = (repeat, index) => {
  if (index === getNrRepeats(repeat)) {
    return true
  }
  if (repeat && typeof repeat === 'object') {
    return !!repeat.teardown
  }
  return false
}

export default shouldRunTeardown
