const test = require('./test')
const reporters = require('./reporters')

module.exports = (testCase, reporterType) => {
    
    const reporter = reporters[reporterType]

    return new Promise((resolve, reject) => {
        test(testCase, reporter)
            .exec()
                .then((result) => {
                    resolve('Done running', result)
                })
                .catch((err) => {
                    reject(err)
                })
    })
}
