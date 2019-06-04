const getNrRepeats = repeat => {
  if (typeof repeat === 'object' && !!repeat && repeat.times) {
    return repeat.times || 0
  }
  return repeat || 0
}

export default getNrRepeats
