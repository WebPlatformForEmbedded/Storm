/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
	'title'         : 'WPEWebkit performance test using perf.html',
    'description'   : 'Loads perf.html test page and runs fake guide',
    'samples'       : [],
    'minFPS'        : 25, // minimum FPS or this test will fail
    'extends'       : 'WEBKIT-PERFORMANCE-012.js', // use WEBKIT-PERFORMANCE-012.js as base, extend just the required functions
    'steps'         : {
    	'step5' : {
            'description'   : 'Load the app on WPEWebkit',
            'test'          : function (x, cb) {
                var _url = `http://${task.server}:8080/tests/wpetest.html`;
                setUrl(_url, cb);
            },
            'validate'      : httpResponseSimple
        },
    	'step6' : {
            'sleep'         : 3,
            'description'   : 'Check if app is loaded on WPEWebkit',
            'test'          : getUrl,
            'validate'      : (resp) => {
                if (resp === `http://${task.server}:8080/tests/wpetest.html`)
                    return true;
                
                throw new Error('URL did not load on WPEWebkit');
            }
        },
        'step8' : {
            'description'   : 'Repeat get FPS a couple of times to get samples',
            'goto'          : 'step7',
            'repeat'        : 20,
        }
	}
}
