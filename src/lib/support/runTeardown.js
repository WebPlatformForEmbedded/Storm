import executeAsPromise from './executeAsPromise'

const runTeardown = (context, method) => {
  if (method && typeof method === 'function') {
    context.reporter.log('Running Test Teardown')
  }
  return executeAsPromise(method, null, context.test)
}

export default runTeardown
