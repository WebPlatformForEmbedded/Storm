export default chai => {
  const types = ['string', 'number', 'boolean', 'undefined', 'function', 'object', 'array']

  types.forEach(type => {
    chai.Assertion.addMethod(type, function() {
      const val = this._obj
      this.assert(
        type === 'array' ? Array.isArray(val) : typeof val === type,
        'expected #{this} to to be ' + type,
        'expected #{this} to not be ' + type
      )
    })
  })
}
