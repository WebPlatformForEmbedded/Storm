import executeAsPromise from './executeAsPromise'

const calculateSleep = (sleep, context) => {
  return executeAsPromise(sleep, null, context).then(sleep => sleep * 1000)
}

export default calculateSleep
