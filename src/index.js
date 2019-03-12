import runner from './runner'
import config from '../config'

// config globally available so we can access the ip (not super happy with this, btw)
global.config = config

window.start = () => {
    runner(config.tests, 'browser')
}

window.startInWebworker = () => {
    let worker = new Worker('./webworker.js?' + Math.random());
   
    // give the signal to start the webworker
    worker.postMessage('start');

    // update the UI based on messages received back from web worker
    worker.addEventListener('message',  e => {
        write(e.data)
    })
}

// just a helper function to write to a div
const write = (str) => {
    let div = document.getElementById('output2')
    if(!div) {
        div = document.createElement('div')
        div.setAttribute('id', 'output2')
        document.body.appendChild(div)
    }

    div.innerHTML = '<p>' + str + '</p>' + div.innerHTML

}