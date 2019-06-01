const getNrRepeats = repeat => {
  if (typeof repeat === 'object' && !!repeat && repeat.times) {
    return repeat.times || 1
  }
  return repeat || 1
}

export default getNrRepeats
