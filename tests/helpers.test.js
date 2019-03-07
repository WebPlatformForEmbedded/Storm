const helpers = require('../testrunner/helpers')

module.exports = {
    title: 'Helper library',
    description: 'Test using function from helper library',
    steps: [
        {
            description: 'A test from helper library',
            test: helpers.tests.dummy,
            params: 1,
            assert: 1
        },
        {
            description: 'A validate from helper library',
            test: helpers.tests.dummy,
            params: 1,
            validate: helpers.validators.dummy
        },
        {
            description: 'An async http test from helper library',
            test: helpers.tests.getUrl,
            params: 'http://www.metrological.com',
            validate: helpers.validators.httpSuccess
        },
        {
            description: 'An async http test from helper library',
            test: helpers.tests.getUrl,
            params: 'http://www.metrological.com/dgjahsgdhjashjd',
            validate: helpers.validators.httpNotFound
        }
    ]
}
