import contra from 'contra'
import testrunner from '../testrunner'

export default (tests, reporter) => {
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