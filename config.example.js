export default {
    ip: '192.168.1.10',
    tests: [
        require('./tests/dummy.test.js').default,
        require('./tests/helpers.test.js').default,
        require('./tests/youtube.test.js').default,
        // note: the timeout tests fail (by design) so we can't run both in the same run
        // require('./tests/timeout-requests.test.js').default,
        require('./tests/timeout-custom.test.js').default,
    ],
    reporter: 'console',
}
