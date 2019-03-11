const runner = require('./runner')
const config = require('../config')
const reporter = require('./webworker-reporter')

// config globally available so we can access the ip (not super happy with this, btw)
global.config = config

self.addEventListener('message',  e => {

    if(e.data === 'start') {
        runner(config.tests, reporter(self))
    }

})
