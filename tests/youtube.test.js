const helpers = require('../testrunner/helpers')

module.exports = {
    title: 'YouTube test',
    description: 'Basic YouTube test',
    steps: [
        {
            description: 'Stop webkit browser',
            test: helpers.tests.stopPlugin,
            params: 'WebKitBrowser',
            validate: helpers.validators.httpSuccess,
        },
        {
            description: 'Stop Youtube',
            test: helpers.tests.stopPlugin,
            params: 'YouTube',
            validate: helpers.validators.httpSuccess,
            sleep: 5,
        },
        {
            description: 'Start Youtube',
            test: helpers.tests.startPlugin,
            params: 'YouTube',
            validate: helpers.validators.httpSuccess,
            sleep: 5,
        },
        {
            description: 'Set Youtube URL',
            test: helpers.tests.setPluginUrl,
            params: ['YouTube', 'https://www.youtube.com/tv#/watch/video/control?v=RDfjXj5EGqI'],
            validate: helpers.validators.httpSuccess,
            sleep: 5,
        },
        {
            description: 'Resume Youtube',
            test: helpers.tests.resumePlugin,
            params: 'YouTube',
            validate: helpers.validators.httpSuccess,
            sleep: 5,
        },
        {
            description: 'Check CPU load',
            test: helpers.tests.getCpuLoad,
            validate: (cpuLoad) => cpuLoad <= 90,
            sleep: 5,
        },
    ]
}
