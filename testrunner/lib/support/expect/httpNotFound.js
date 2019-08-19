export default (chai, _) => {
  const Assertion = chai.Assertion
  const flag = _.flag

  Assertion.addMethod('httpNotFound', function(msg) {
    if (msg) flag(this, 'message', msg)

    const response = this._obj
    this.assert(
      response.status === 404,
      'expected #{this} to to be a http not found (404)',
      'expected #{this} to not be a http not found (404)'
    )
  })
}
