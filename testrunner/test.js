const contra = require('contra')
const Step = require('./step')

module.exports = (test, reporter) => {

    return {
        exec() {
            
            reporter.log('Executing ' + test.description)

            return new Promise((resolve, reject) => {
                contra.each.series(test.steps, (step, key, next) => {

                    try {
                        Step(step, reporter).exec().then(pass => {
                            reporter.pass(step.description)
                            next()
                        }).catch(err => {
                            reporter.fail(step.description, err)
                            next(err)
                        })
                    }
                    catch(e) {
                        next(e)
                    }
                    
                }, (err) => {
                    if(err) {
                        reporter.error(err);
                        reject(err)
                    }
                    else {
                        reporter.success('All tests passed')
                        resolve()
                    }
                })
            })
        }
    }
    
}
