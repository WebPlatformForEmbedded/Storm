const runner = require('./runner')
const config = require('../config')

// config globally available so we can access the ip (not super happy with this, btw)
global.config = config

self.addEventListener('message',  e => {

    if(e.data === 'start') {
        runner(config.tests, webworkerReporter)
    }

})

const webworkerReporter = {
    log(msg) {
        console.log('web worker ➡️  ' + msg)
    },
    pass(description) {
        console.log('web worker ✅  Step `' + description + '` passed')
    },
    fail(description, err) {
        console.log('web worker ❌  Step  `' + description + '` failed', err)
    },
    success() {
        console.log('web worker 👍  Success')
    },
    error() {
        console.log('web worker 😭  Error')
    },
}
