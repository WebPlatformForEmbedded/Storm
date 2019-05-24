import getNrRepeats from './getNrRepeats'

const shouldRunTeardown = (repeat, index) => {
  // always run on the last repeat
  if (index == getNrRepeats(repeat) - 1) {
    return true
  }
  if (repeat && typeof repeat === 'object') {
    return !!repeat.teardown
  }
}

export default shouldRunTeardown
