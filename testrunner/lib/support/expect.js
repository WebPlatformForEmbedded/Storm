import Expect from 'expect'

const wrapper = expect => {
  return new Proxy(expect, {
    get(target, propKey) {
      const origMethod = target[propKey]

      switch (typeof origMethod) {
        case 'function':
          return function(...args) {
            try {
              origMethod.apply(this, args)
              return true
            } catch (e) {
              return e
            }
          }
        case 'object':
          return wrapper(origMethod)
      }
    },
  })
}

export default val => wrapper(Expect(val))
