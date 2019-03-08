const runner = require('./runner')
const config = require('../config')

// config globally available so we can access the ip (not super happy with this, btw)
global.config = config

window.start = () => {
    runner(config.tests, 'browser')
}

window.startInWebworker = () => {
    let worker = new Worker('./webworker.js?' + Math.random());
    worker.postMessage('start');
}
