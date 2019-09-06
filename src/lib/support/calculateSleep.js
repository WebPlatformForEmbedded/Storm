import executeAsPromise from './executeAsPromise'

const calculateSleep = (context, sleep) => {
  return executeAsPromise(sleep, null, context).then(sleep => sleep * 1000)
}

export default calculateSleep
