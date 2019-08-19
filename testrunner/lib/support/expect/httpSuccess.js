export default (chai, _) => {
  const Assertion = chai.Assertion
  const flag = _.flag

  Assertion.addMethod('httpSuccess', function(msg) {
    if (msg) flag(this, 'message', msg)

    const response = this._obj
    this.assert(
      response.status === 200,
      'expected #{this} to to be a http success (200)',
      'expected #{this} to not be a http success (200)'
    )
  })
}
