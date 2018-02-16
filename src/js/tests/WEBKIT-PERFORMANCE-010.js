/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'             : 'WPEWebkit performance racer-s',
    'description'       : 'Loads the Racer-S WebGL animation and measures its performance',
    'requiredPlugins'   : ['WebKitBrowser'],
    'samples'           : [],
    'minFPS'            : 30, // minimum FPS or this test will fail
    'extends'           : 'WEBKIT-PERFORMANCE-001.js', // use WEBKIT-PERFORMANCE-001.js as base, extend just the required functions
    'steps'             : {
        'step5' : {
            'description'   : 'Load http://helloracer.com/racer-s/',
            'timeout'       : 180, //seconds
            'test'          : setUrl,
            'params'        : 'http://helloracer.com/racer-s/',
            'validate'      : httpResponseSimple
        },
        'step6' : {
            'sleep'         : 30,
            'description'   : 'Check if URL is loaded',
            'timeout'       : 180, //seconds
            'test'          : getUrl,
            'assert'        : 'http://helloracer.com/racer-s/'
        }
    }
};
