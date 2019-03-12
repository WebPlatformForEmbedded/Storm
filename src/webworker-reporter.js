export default (worker) => {

    return {
        log(msg) {
            worker.postMessage('➡️  ' + msg)
        },
        pass(description) {
            worker.postMessage('✅  Step `' + description + '` passed')
        },
        fail(description, err) {
            worker.postMessage('❌  Step  `' + description + '` failed', err)
        },
        success() {
            worker.postMessage('👍  Success')
        },
        error() {
            worker.postMessage('😭  Error')
        },
    }
}


