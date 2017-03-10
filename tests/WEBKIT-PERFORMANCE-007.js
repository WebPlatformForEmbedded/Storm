/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'         : 'WPEWebkit performance anisotropic',
    'description'   : 'Loads the Anisotropic WebGL animation and measures its performance',
    'samples'       : [],
    'minFPS'        : 50, // minimum FPS or this test will fail
    'extends'       : 'WEBKIT-PERFORMANCE-001.js', // use WEBKIT-PERFORMANCE-001.js as base, extend just the required functions
    'steps'         : {
        'step5' : {
            'description'   : 'Load http://whiteflashwhitehit.com/content/2011/02/anisotropic_webgl.html',
            'timeout'       : 180, //seconds
            'test'          : setUrl,
            'params'        : 'http://whiteflashwhitehit.com/content/2011/02/anisotropic_webgl.html',
            'validate'      : httpResponseSimple
        },
        'step6' : {
            'sleep'         : 30,
            'description'   : 'Check if URL is loaded',
            'timeout'       : 180, //seconds
            'test'          : getUrl,
            'assert'        : 'http://whiteflashwhitehit.com/content/2011/02/anisotropic_webgl.html'
        }
    }
};
