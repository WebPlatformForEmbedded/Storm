import runner from './runner'
import config from '../config'
import reporter from './webworker-reporter'

// config globally available so we can access the ip (not super happy with this, btw)
global.config = config

self.addEventListener('message',  e => {

    if(e.data === 'start') {
        runner(config.tests, reporter(self))
    }

})
