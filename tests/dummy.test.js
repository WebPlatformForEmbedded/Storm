module.exports = {
    title: 'Dummy test',
    description: 'Some basic dummy tests',
    steps: [
        {
            description: 'A synchronous test with assert',
            test: (x) => x,
            params: 1,
            assert: 1
        },
        {
            description: 'A synchronous test with a custom validate function',
            test: (x) => x,
            params: 1,
            validate: (x) => x === x
        },
        {
            description: 'An asynchronous test with assert',
            test: async (x) => x,
            params: 1,
            assert: 1
        },
        {
            description: 'A synchronous test with a sleep',
            sleep: 2,
            test: (x) => x,
            params: 1,
            assert: 1
        },
    ]
}
