/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
	'title'         : 'WPEWebkit performance test using perf.html',
    'description'   : 'Loads perf.html test page and runs fake guide',
    'samples'       : [],
    'minFPS'        : 50, // minimum FPS or this test will fail
    'steps'         : {
        'init1' : {
            'description'   : 'Start file server',
            'timeout'		: 60,
            'test'          : startFileServer,
        },
        'step1' : {
            'description'   : 'Determine IP to use',
            'test'          : matchIpRange,
            'params'        : host,
            'validate'      : (response) => {
            	//console.log(response);
                if (response === undefined)
                    return false;

                task.server = response;
                return true;
            }
        },
        'step2' : {
            'description'   : 'Stop the WPEWebkit Plugin',
            'test'          : stopPlugin,
            'params'        : 'WebKitBrowser'
        },
        'step3' : {
            'sleep'         : 15,
            'description'   : 'Start the WPEWebkit Plugin',
            'test'          : startAndResumePlugin,
            'params'        : 'WebKitBrowser'
        },
        'step4' : {
            'sleep'         : 10,
            'description'   : 'Check if the WPEWebkit Plugin is started',
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'validate'      : checkResumedOrActivated
        },
    	'step5' : {
            'description'   : 'Load the app on WPEWebkit',
            'test'          : function (x, cb) {
                var _url = `http://${task.server}:8080/perf.html`;
                setUrl(_url, cb);
            },
            'validate'      : httpResponseSimple
        },
    	'step6' : {
            'sleep'         : 3,
            'description'   : 'Check if app is loaded on WPEWebkit',
            'test'          : getUrl,
            'validate'      : (resp) => {
                if (resp === `http://${task.server}:8080/perf.html`)
                    return true;
                
                throw new Error('URL did not load on WPEWebkit');
            }
        },
        'step7' : {
            'sleep'         : 3,
            'description'   : 'Get FPS from WPEWebkit',
            'timeout'       : 20,
            'test'          : getFPS,
            'validate'      : (fps) => {
                // if FPS is a number, add it to our samples. Else fail the test
                if (isNaN(fps) === false){
                    task.samples.push(fps);
                    return true;
                } else {
                    throw new Error('Returned FPS value from Framework is not a number');
                }
            }
        },
        'step8' : {
            'description'   : 'Repeat get FPS a couple of times to get samples',
            'goto'          : 'step7',
            'repeat'        : 10,
        },
        'step9' : {
            'description'   : 'Calculate average FPS',
            'timeout'       : 30,
            'test'          : (cb) => {
                var results = {};
                function calcAverage(_cb) {
                    var sum = 0;
                    for (var i=0; i<task.samples.length; i++){
                        sum += task.samples[i];

                        if (i == task.samples.length-1){
                            results.average = sum/task.samples.length;
                            results.average = results.average.toFixed(2);
                            console.log('Average: ' + results.average);
                            _cb();
                        }
                    }
                }

                function calcMedian(_cb) {
                    var sortedSamples = task.samples.sort(function(a, b){return a-b;});
                    results.lowest = sortedSamples[0];
                    results.highest = sortedSamples[sortedSamples.length-1];
                    results.median = sortedSamples[ Math.round(sortedSamples.length/2) ];
                    _cb();
                }

                // first calculate average
                calcAverage(() => {
                    // then median
                    calcMedian(() => {
                        // callback with results
                        cb(results);
                    });
                });
            },
            'validate'      : (results) => {
                msg = JSON.stringify(results);

                if (results.average > task.minFPS)
                    return true
                else
                    throw new Error(`Minimum FPS was not met. Expected minimum is ${task.minFPS}, average is: ${results.average}`);
            }
        },
        'cleanup1' : {
            'description'   : 'Clean up the test',
            'timeout'       : 60,
            'test'          : setUrl,
            'params'        : 'about:blank',
            'validate'      : httpResponseSimple
        }
	}
}
