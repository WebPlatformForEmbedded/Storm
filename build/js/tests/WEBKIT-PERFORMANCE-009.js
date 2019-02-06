/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'             : 'WPEWebkit performance pasta',
    'description'       : 'Loads the pasta WebGL animation and measures its performance',
    'requiredPlugins'   : ['WebKitBrowser'],
    'samples'           : [],
    'minFPS'            : 5, // minimum FPS or this test will fail
    'extends'           : 'WEBKIT-PERFORMANCE-001', // use WEBKIT-PERFORMANCE-001.js as base, extend just the required functions
    'steps'             : {
        'step5' : {
            'description'   : 'Load http://alteredqualia.com/three/examples/webgl_pasta.html',
            'timeout'       : 180, //seconds
            'test'          : setUrl,
            'params'        : 'http://alteredqualia.com/three/examples/webgl_pasta.html',
            'validate'      : httpResponseSimple
        },
        'step6' : {
            'sleep'         : 30,
            'description'   : 'Check if URL is loaded',
            'timeout'       : 180, //seconds
            'test'          : getUrl,
            'assert'        : 'http://alteredqualia.com/three/examples/webgl_pasta.html'
        }
    }
};
