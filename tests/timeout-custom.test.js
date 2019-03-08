const helpers = require('../testrunner/helpers')

const customTimeoutTest = function(wait) {
    return new Promise((resolve, reject) => {
        const action = setTimeout(() => {
            cleanup()
            resolve(wait)
        }, wait * 1000)

        const timer = setTimeout(() => {
            cleanup()
            reject('Max execution time exceeded')
        }, this.timeout * 1000)

        const cleanup = () => {
            clearTimeout(timer)
            clearTimeout(action)
        }
    })
}

module.exports = {
    title: 'Timeout',
    description: 'Testing timeouts in custom methods',
    steps: [
        {
            description: 'A test (custom test function) with a timeout that finishes on time',
            timeout: 10,
            test: customTimeoutTest,
            params: 5,
            assert: 5
        },
        {
            description: 'A test (custom test function) with a timeout that exceeds the maximum execution time',
            timeout: 5,
            test: customTimeoutTest,
            params: 10,
            assert: 10
        },
    ]
}
