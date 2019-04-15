import contra from 'contra'
import Step from './step'

export default (test, reporter, device) => {

    return {
        exec() {
            
            reporter.log('Executing ' + test.description)

            return new Promise((resolve, reject) => {
                contra.each.series(test.steps, (step, key, next) => {

                    // make device info available in the step as this.device
                    step.device = device

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
