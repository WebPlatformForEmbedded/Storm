import helpers from '../testrunner/helpers'

export default {
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
            description: 'An async http test from helper library (200 request)',
            test: helpers.tests.getUrl,
            params: 'https://api.github.com/',
            validate: helpers.validators.httpSuccess
        },
        {
            description: 'An async http test from helper library (404 request)',
            test: helpers.tests.getUrl,
            params: 'https://api.github.com/404',
            validate: helpers.validators.httpNotFound
        }
    ]
}
