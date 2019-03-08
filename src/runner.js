const contra = require('contra')
const testrunner = require('../testrunner')

module.exports = (tests, reporter) => {
    contra.each.series(tests, (test, next) => {
        testrunner(test, reporter)
            .then(() => {
                setTimeout(next, 2000)
            })
            .catch(err => {
                next(err)
            })
    })
}