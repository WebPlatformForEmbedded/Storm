const calculateRepeat = repeat => {
  if (repeat && typeof repeat === 'function') {
    repeat = repeat()
  }
  return repeat
}

export default calculateRepeat
