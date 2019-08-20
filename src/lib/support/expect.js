import { expect as Expect, use } from 'chai'
import extensions from './expect/index.js'

Object.values(extensions).forEach(extension => {
  use(extension)
})

const wrapper = expect => {
  return new Proxy(expect, {
    get(target, propKey) {
      const original = target[propKey]

      if (typeof original == 'object') {
        return wrapper(original)
      } else {
        return function(...args) {
          try {
            original.apply(target, args)
            return true
          } catch (e) {
            return e.message
          }
        }
      }
    },
  })
}

export default val => wrapper(Expect(val))
