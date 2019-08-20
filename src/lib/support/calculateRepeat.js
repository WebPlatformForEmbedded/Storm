const calculateRepeat = (repeat, context) => {
  if (repeat && typeof repeat === 'function') {
    repeat = repeat.call(context)
  }
  return repeat
}

export default calculateRepeat
