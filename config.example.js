module.exports = {
    ip: '192.168.1.10',
    tests: [
        require('./tests/dummy.test.js'),
        require('./tests/helpers.test.js'),
        require('./tests/youtube.test.js'),
        // note: the timeout tests fail (by design) so we can't run both in the same run
        // require('./tests/timeout-requests.test.js'),
        require('./tests/timeout-custom.test.js'),
    ],
    reporter: 'console',
}
