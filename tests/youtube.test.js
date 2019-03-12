import helpers from '../testrunner/helpers'

export default {
    title: 'YouTube test',
    description: 'Basic YouTube test',
    steps: [
        {
            description: 'Stop webkit browser',
            timeout: 5,
            test: helpers.tests.stopPlugin,
            params: 'WebKitBrowser',
            validate: helpers.validators.httpSuccess,
        },
        {
            description: 'Stop Youtube',
            timeout: 5,
            test: helpers.tests.stopPlugin,
            params: 'YouTube',
            validate: helpers.validators.httpSuccess,
            sleep: 5,
        },
        {
            description: 'Start Youtube',
            timeout: 5,
            test: helpers.tests.startPlugin,
            params: 'YouTube',
            validate: helpers.validators.httpSuccess,
            sleep: 5,
        },
        {
            description: 'Set Youtube URL',
            timeout: 5,
            test: helpers.tests.setPluginUrl,
            params: ['YouTube', 'https://www.youtube.com/tv#/watch/video/control?v=RDfjXj5EGqI'],
            validate: helpers.validators.httpSuccess,
            sleep: 5,
        },
        {
            description: 'Resume Youtube',
            timeout: 5,
            test: helpers.tests.resumePlugin,
            params: 'YouTube',
            validate: helpers.validators.httpSuccess,
            sleep: 5,
        },
        {
            description: 'Check CPU load',
            timeout: 5,
            test: helpers.tests.getCpuLoad,
            validate: (cpuLoad) => cpuLoad <= 90,
            sleep: 5,
        },
    ]
}
