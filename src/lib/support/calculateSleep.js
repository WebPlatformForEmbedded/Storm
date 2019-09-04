import executeAsPromise from './executeAsPromise'

const calculateSleep = sleep => {
  return executeAsPromise(sleep).then(sleep => sleep * 1000)
}

export default calculateSleep
