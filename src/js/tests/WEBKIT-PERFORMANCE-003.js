/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'             : 'WPEWebkit performance falling leaves',
    'description'       : 'Loads the falling leaves CSS3 animation and measures its performance',
    'requiredPlugins'   : ['WebKitBrowser'],
    'samples'           : [],
    'minFPS'            : 40, // minimum FPS or this test will fail
    'extends'           : 'WEBKIT-PERFORMANCE-001', // use WEBKIT-PERFORMANCE-001.js as base, extend just the required functions
    'steps'             : {
        'step5' : {
            'description'   : 'Load https://webkit.org/blog-files/leaves/',
            'timeout'       : 180, //seconds
            'test'          : setUrl,
            'params'        : 'https://webkit.org/blog-files/leaves/',
            'validate'      : httpResponseSimple
        },
        'step6' : {
            'sleep'         : 30,
            'description'   : 'Check if URL is loaded',
            'timeout'       : 180, //seconds
            'test'          : getUrl,
            'assert'        : 'https://webkit.org/blog-files/leaves/'
        }
    }
};
