/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'             : 'WPEWebkit performance man in blue',
    'description'       : 'Loads the Man in Blue Canvas animation and measures its performance',
    'requiredPlugins'   : ['WebKitBrowser'],
    'samples'           : [],
    'minFPS'            : 10, // minimum FPS or this test will fail
    'extends'           : 'WEBKIT-PERFORMANCE-001.js', // use WEBKIT-PERFORMANCE-001.js as base, extend just the required functions
    'steps'             : {
        'step5' : {
            'description'   : 'Load http://themaninblue.com/experiment/AnimationBenchmark/canvas/',
            'timeout'       : 180, //seconds
            'test'          : setUrl,
            'params'        : 'http://themaninblue.com/experiment/AnimationBenchmark/canvas/',
            'validate'      : httpResponseSimple
        },
        'step6' : {
            'sleep'         : 30,
            'description'   : 'Check if URL is loaded',
            'timeout'       : 180, //seconds
            'test'          : getUrl,
            'assert'        : 'http://themaninblue.com/experiment/AnimationBenchmark/canvas/'
        }
    }
};
