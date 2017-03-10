/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'         : 'WPEWebkit performance morphing cube',
    'description'   : 'Loads the Morphing Cube CSS3 animation and measures its performance',
    'samples'       : [],
    'minFPS'        : 40, // minimum FPS or this test will fail
    'extends'       : 'WEBKIT-PERFORMANCE-001.js', // use WEBKIT-PERFORMANCE-001.js as base, extend just the required functions
    'steps'         : {
        'step5' : {
            'description'   : 'Load http://www.webkit.org/blog-files/3d-transforms/morphing-cubes.html',
            'timeout'       : 180, //seconds
            'test'          : setUrl,
            'params'        : 'http://www.webkit.org/blog-files/3d-transforms/morphing-cubes.html',
            'validate'      : httpResponseSimple
        },
        'step6' : {
            'sleep'         : 30,
            'description'   : 'Check if URL is loaded',
            'timeout'       : 180, //seconds
            'test'          : getUrl,
            'assert'        : 'https://webkit.org/blog-files/3d-transforms/morphing-cubes.html'
        }
    }
};
