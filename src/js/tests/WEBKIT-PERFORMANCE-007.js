/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'             : 'WPEWebkit performance anisotropic',
    'description'       : 'Loads the Particles webGL animation and measures its performance',
    'requiredPlugins'   : ['WebKitBrowser'],
    'samples'           : [],
    'minFPS'            : 20, // minimum FPS or this test will fail
    'extends'           : 'WEBKIT-PERFORMANCE-001', // use WEBKIT-PERFORMANCE-001.js as base, extend just the required functions
    'steps'             : {
        'step5' : {
            'description'   : 'http://oos.moxiecode.com/js_webgl/particles_morph/',
            'timeout'       : 180, //seconds
            'test'          : setUrl,
            'params'        : 'http://oos.moxiecode.com/js_webgl/particles_morph/',
            'validate'      : httpResponseSimple
        },
        'step6' : {
            'sleep'         : 30,
            'description'   : 'Check if URL is loaded',
            'timeout'       : 180, //seconds
            'test'          : getUrl,
            'assert'        : 'http://oos.moxiecode.com/js_webgl/particles_morph/'
        }
    }
};
