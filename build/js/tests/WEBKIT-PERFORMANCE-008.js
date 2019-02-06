/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'             : 'WPEWebkit performance helloracer',
    'description'       : 'Loads the Helloracer WebGL animation and measures its performance',
    'requiredPlugins'   : ['WebKitBrowser'],
    'samples'           : [],
    'minFPS'            : 40, // minimum FPS or this test will fail
    'extends'           : 'WEBKIT-PERFORMANCE-001', // use WEBKIT-PERFORMANCE-001.js as base, extend just the required functions
    'steps'             : {
        'step5' : {
            'description'   : 'Load http://helloracer.com/webgl/',
            'timeout'       : 180, //seconds
            'test'          : setUrl,
            'params'        : 'http://helloracer.com/webgl/',
            'validate'      : httpResponseSimple
        },
        'step6' : {
            'sleep'         : 30,
            'description'   : 'Check if URL is loaded',
            'timeout'       : 180, //seconds
            'test'          : getUrl,
            'assert'        : 'http://helloracer.com/webgl/'
        }
    }
};
