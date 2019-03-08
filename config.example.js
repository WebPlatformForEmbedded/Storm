module.exports = {
    ip: '192.168.1.10',
    tests: [
        require('./tests/dummy.test.js'),
        require('./tests/helpers.test.js'),
        require('./tests/youtube.test.js'),
        require('./tests/timeout-requests.test.js'),
    ],
    reporter: 'console',
}
