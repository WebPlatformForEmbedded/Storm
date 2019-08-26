import executeAsPromise from './executeAsPromise'

export default (sequence, pause = 500) => {
  return sequence
    .map(method => {
      return () =>
        new Promise((resolve, reject) => {
          return executeAsPromise(method, null, this.test)
            .then(res => {
              setTimeout(() => {
                resolve(res)
              }, pause)
            })
            .catch(reject)
        })
    })
    .reduce((promise, method) => {
      return promise.then(() => method())
    }, Promise.resolve(null))
}
