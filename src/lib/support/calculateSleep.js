const calculateSleep = sleep => {
  if (sleep && typeof sleep === 'function') {
    sleep = sleep()
  }
  return sleep * 1000
}

export default calculateSleep
