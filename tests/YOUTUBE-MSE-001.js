/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'         : 'YouTube Media Source conformance test',
    'description'   : 'Loads the YouTube MSE 2016 conformance test and captures the output',
    'testCount'     : 57,
    'steps'         : {
       'step1' : {
            'description'   : 'Stop WPEWebkit',
            'test'          : stopPlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple,
        },
        'step2' : {
            'sleep'         : 30,
            'description'   : 'Check if WPEWebkit is stopped correctly',
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'assert'        : 'deactivated'
        },
        'step3' : {
            'description'   : 'Start WPEWebkit',
            'test'          : startAndResumePlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple
        },
        'step4' : {
            'sleep'         : 30,
            'description'   : 'Check if WPEWebkit is started correctly',
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'validate'      : checkResumedOrActivated,
        },
        'step5' : {
            'description'   : 'Set the MSE 2016 URL',
            'test'          : setUrl,
            'params'        : 'http://yt-dash-mse-test.commondatastorage.googleapis.com/unit-tests/2016.html?enablewebm=off',
            'validate'      : httpResponseSimple
        },
        'step6' : {
            'description'   : 'Attach to the logs to capture the log output',
            'timeout'       : 10 * 60, // 10 minutes
            'test'          : function(cb) {

                var testOK = 0;
                var testsRun = 0;
                var testsFailed = 0;
                var testsTimedout = 0;

                var failedTests = [];
                var timedoutTests = [];

                var currentTestNr;
                var currentTest;

                function parseGoogleLogs(error, log){
                    //console.log(log);

                    const testStarted = /STARTED/g;
                    const testSucceeded = /PASSED./g;
                    const testTimedout = /TIMED OUT!/g;
                    const testFailed = /FAILED/g;
                    const testsDone = /All tests are completed/g;

                    if (testStarted.test(log)){
                        //Information: TestExecutor:  Test 29:VideoBufferSize STARTED with timeout 30000
                        var test = log.split('TestExecutor:  Test ')[1];
                        currentTest = test.split(' STARTED with timeout')[0];
                        testsRun++;
                        //console.log('Test ' + currentTest + ' started');
                    }

                    if (testSucceeded.test(log)){
                        testOK++;
                        //console.log('Test ' + currentTest + ' succeeded');
                    }

                    if (testTimedout.test(log)){
                        timedoutTests.push(currentTest);
                        testsTimedout++;

                        //console.log('Test ' + currentTest + ' timedout');
                    }

                    if (testFailed.test(log)){
                        failedTests.push(currentTest);
                        testsFailed++;

                        //console.log('Test ' + currentTest + ' failed');
                    }

                    if (testsDone.test(log)){
                        function _endTest(){
                            var results = {
                                'failed' : {
                                    'amount' : testsFailed,
                                    'tests'  : failedTests
                                },
                                'timedout' : {
                                    'amount' : testsTimedout,
                                    'tests'  : timedoutTests
                                },
                                'testsRun' : testsRun,
                            };

                            logger.disconnect();
                            cb(results);
                        }

                        /* wait just a bit, we may get some more stuff */
                        setTimeout(_endTest, 15000);
                    }
                }

                var logger = new AttachToLogs(parseGoogleLogs);
                logger.connect(function(){
                    setTimeout(key, 10000, enter, () => {});
                });
            },
            'validate'      : (results) => {
                if (results.failed.amount === 0 && results.timedout.amount === 0 && results.testsRun === task.testCount)
                    return true;


                var error = `Tests run: ${results.testsRun} of ${task.testCount}. `;
                error += 'Tests failed: ' + results.failed.tests + '. ';
                error += 'Tests timedout: ' + results.timedout.tests + '. ';
                throw new Error(error);
            }
        },
        'step7' : {
            'description'       : 'Cleanup the test',
            'test'              : setUrl,
            'params'            : 'about:blank'
        }
    }
};
