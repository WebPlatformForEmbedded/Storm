export default (chai, _) => {
  const Assertion = chai.Assertion
  const flag = _.flag

  Assertion.addMethod('httpStatus', function(status, msg) {
    if (msg) flag(this, 'message', msg)

    const response = this._obj
    this.assert(
      response.status === status,
      'expected #{this} to to be ' + status,
      'expected #{this} to not be ' + status
    )
  })
}
