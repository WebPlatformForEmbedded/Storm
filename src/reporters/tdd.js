const reporter = function() {
  const output = []
  return new Proxy(
    {},
    {
      get(target, name) {
        if (name === 'results') {
          return output
        }
        return function() {
          output.push({ action: name, arguments: Array.from(arguments) })
        }
      },
    }
  )
}

export default reporter
