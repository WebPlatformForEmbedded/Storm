/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'             : 'WPEWebkit performance poster circle',
    'description'       : 'Loads the Poster Circle CSS3 animation and measures its performance',
    'requiredPlugins'   : ['WebKitBrowser'],
    'samples'           : [],
    'minFPS'            : 40, // minimum FPS or this test will fail
    'steps'             : {
        'init1' : {
            'description'   : 'Disable monitor',
            'test'          : stopPlugin,
            'params'        : 'Monitor',
            'validate'      : httpResponseSimple
        },
        'step1' : {
            'description'   : 'Stop WPEWebkit',
            'timeout'       : 180, //seconds
            'test'          : stopPlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple,
        },
        'step2' : {
            'sleep'         : 20,
            'description'   : 'Check if WPEWebkit is succesfully stopped',
            'timeout'       : 30, //seconds
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'assert'        : 'deactivated'
        },
        'step3' : {
            'description'   : 'Start WPEWebkit',
            'timeout'       : 180, //seconds
            'test'          : startAndResumePlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple
        },
        'step4' : {
            'sleep'         : 20,
            'description'   : 'Check if WPEWebkit is started',
            'timeout'       : 180, //seconds
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'validate'      : checkResumedOrActivated
        },
        'step5' : {
            'description'   : 'Load http://webkit.org/blog-files/3d-transforms/poster-circle.html',
            'timeout'       : 180, //seconds
            'test'          : setUrl,
            'params'        : 'http://webkit.org/blog-files/3d-transforms/poster-circle.html',
            'validate'      : httpResponseSimple
        },
        'step6' : {
            'sleep'         : 30,
            'description'   : 'Check if URL is loaded',
            'timeout'       : 180, //seconds
            'test'          : getUrl,
            'assert'        : 'https://webkit.org/blog-files/3d-transforms/poster-circle.html'
        },
        'step7' : {
            'sleep'         : 5,
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
            'repeat'        : 12,
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
        },
        'cleanup2' : {
            'description'   : 'Enable monitor',
            'test'          : startPlugin,
            'params'        : 'Monitor',
            'validate'      : httpResponseSimple
        }
    }
};
