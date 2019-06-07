import Expect from 'expect'

const wrapper = expect => {
  return new Proxy(expect, {
    get(target, propKey) {
      const origMethod = target[propKey]
      return function(...args) {
        try {
          origMethod.apply(this, args)
          return true
        } catch (e) {
          return e
        }
      }
    },
  })
}

export default val => wrapper(Expect(val))
