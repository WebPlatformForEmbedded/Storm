import helpers from '../testrunner/helpers'

const port = 1313

export default {
    title: 'Timeout',
    description: 'Testing timeouts in http requests',
    steps: [
        {
            description: 'A http request with a timeout that finishes on time',
            test: helpers.tests.getUrl,
            timeout: 10,
            params: 'http://localhost:' + port + '?timeout=5',
            validate: helpers.validators.httpSuccess
        },
        {
            description: 'A http request with a timeout that exceeds the maximum execution time',
            test: helpers.tests.getUrl,
            timeout: 5,
            params: 'http://localhost:' + port + '?timeout=10',
            validate: helpers.validators.httpSuccess
        }
    ]
}

