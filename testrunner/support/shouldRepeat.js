const shouldRepeat = (context, repeat, index, start) => {
  if (typeof repeat === 'number') {
    return repeat > index
  }
  if (typeof repeat === 'object' && repeat.times) {
    return repeat.times > index
  }
  if (typeof repeat === 'object' && repeat.seconds) {
    const now = new Date()
    const difference = (now.getTime() - start.getTime()) / 1000
    return repeat.seconds > difference
  }

  if (typeof repeat === 'object' && repeat.until && typeof repeat.until === 'function') {
    return !!!repeat.until.apply(context)
  }

  return false
}

export default shouldRepeat
