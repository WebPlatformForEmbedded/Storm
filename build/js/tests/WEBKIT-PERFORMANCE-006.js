/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'             : 'WPEWebkit performance fishietank',
    'description'       : 'Loads the Fish IE tank canvas animation and measures its performance',
    'requiredPlugins'   : ['WebKitBrowser'],
    'samples'           : [],
    'minFPS'            : 2, // minimum FPS or this test will fail
    'extends'           : 'WEBKIT-PERFORMANCE-001', // use WEBKIT-PERFORMANCE-001.js as base, extend just the required functions
    'steps'             : {
        'step5' : {
            'description'   : 'Load http://ie.microsoft.com/testdrive/performance/fishietank/',
            'timeout'       : 180, //seconds
            'test'          : setUrl,
            'params'        : 'http://ie.microsoft.com/testdrive/performance/fishietank/',
            'validate'      : httpResponseSimple
        },
        'step6' : {
            'sleep'         : 30,
            'description'   : 'Check if URL is loaded',
            'timeout'       : 180, //seconds
            'test'          : getUrl,
            'assert'        : 'https://testdrive-archive.azurewebsites.net/performance/fishietank/'
        }
    }
};
