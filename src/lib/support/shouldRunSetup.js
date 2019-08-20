const shouldRunSetup = (repeat, index) => {
  // repetition
  if (index > 0) {
    if (repeat && typeof repeat === 'object') {
      return !!repeat.setup
    }
    return false
  }
  // always run first time
  return true
}

export default shouldRunSetup
