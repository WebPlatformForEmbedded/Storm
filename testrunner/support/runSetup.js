import executeAsPromise from '../lib/executeAsPromise'

const runSetup = (context, method) => {
  if (method && typeof method === 'function') {
    context.reporter.log('Running Test Setup')
  }
  return executeAsPromise(method, null, context.test)
}

export default runSetup
