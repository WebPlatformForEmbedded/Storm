const contra = require('contra')
const testrunner = require('../testrunner')

const config = require('../config')


// config globally available so we can access the ip (not super happy with this, btw)
global.config = config


window.start = () => {
    contra.each.series(config.tests, (test, next) => {
        testrunner(test, 'browser')
            .then(() => {
                setTimeout(next, 2000)
            })
            .catch(err => {
                console.error(err)
                next(err)
            })
    })
}



