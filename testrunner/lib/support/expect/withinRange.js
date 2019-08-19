export default (chai, _) => {
  const Assertion = chai.Assertion
  const flag = _.flag

  Assertion.addMethod('withinRange', function(floor, ceiling, msg) {
    if (msg) flag(this, 'message', msg)
    const value = this._obj
    this.assert(
      value >= floor && value <= ceiling,
      'expected #{this} to be within ' + floor + 'and ' + ceiling,
      'expected #{this} to not be within ' + floor + 'and ' + ceiling
    )
  })
}
