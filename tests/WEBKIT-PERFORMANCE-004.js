/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'             : 'WPEWebkit performance smashcat',
    'description'       : 'Loads the smashcat Canvas animation and measures its performance',
    'requiredPlugins'   : ['WebKitBrowser'],
    'samples'           : [],
    'minFPS'            : 40, // minimum FPS or this test will fail
    'extends'           : 'WEBKIT-PERFORMANCE-001.js', // use WEBKIT-PERFORMANCE-001.js as base, extend just the required functions
    'steps'             : {
        'step5' : {
            'description'   : 'Load http://www.smashcat.org/av/canvas_test/',
            'timeout'       : 180, //seconds
            'test'          : setUrl,
            'params'        : 'http://www.smashcat.org/av/canvas_test/',
            'validate'      : httpResponseSimple
        },
        'step6' : {
            'sleep'         : 30,
            'description'   : 'Check if URL is loaded',
            'timeout'       : 180, //seconds
            'test'          : getUrl,
            'assert'        : 'http://www.smashcat.org/av/canvas_test/'
        }
    }
};
