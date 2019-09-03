export default chai => {
  chai.Assertion.addMethod('objectKeys', function(expected) {
    const object = this._obj

    const keys = Array.isArray(expected) ? expected : Object.keys(expected)

    // check if all keys are present
    const missing = keys.filter(key => key in object === false)
    this.assert(
      missing.length === 0,
      "expected object to have missing key(s) '" + missing.join(', ') + "'",
      "expected object to not have missing key(s) '" + missing.join(', ') + "'"
    )

    // if passed as object with key => value types, assert the correct value type
    if (!Array.isArray(expected)) {
      keys.filter(key =>
        new chai.Assertion(object[key]).to.be.a(expected[key], "Incorrect type for '" + key + "'")
      ).length === keys.length
    }
  })
}
