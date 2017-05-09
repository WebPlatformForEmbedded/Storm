/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'             : 'WPEWebkit shutdown of Framework robustness test',
    'description'       : 'Starts WPEWebkit and stops Framework. Checks if everything is shutdown correctly',
    'requiredPlugins'   : ['WebKitBrowser'],
    'steps'         : {
        'init1' : {
            'description'   : 'Stop Netflix & YouTube',
            'timeout'       : 180, //seconds
            'test'          : stopPlugins,
            'params'        : ['Netflix', 'YouTube'],
        },
        'step1' : {
            'description'   : 'Start WPEWebkit',
            'timeout'       : 180,
            'test'          : startAndResumePlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple
        },
        'step2' : {
            'sleep'         : 30,
            'description'   : 'Check if WPEWebkit is started correctly',
            'timeout'       : 180, //seconds
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'validate'      : checkResumedOrActivated
        },
        'step3' : {
            'description'   : 'Stop Framework',
            'test'          : stopFramework,
            'assert'        : true,
        },
        'step4' : {
            'sleep'         : 5,
            'description'   : 'Check if WebKitBrowserImplementation rpcprocess is gone',
            'test'          : checkIfProcessIsRunning,
            'params'        : 'WebKitBrowserImplementation',
            'assert'        : false
        },
        'step5' : {
            'description'   : 'Start Framework',
            'test'          : startFramework,
            'assert'        : true
        },
        'step6' : {
            'description'   : 'Repeat',
            'goto'          : 'step1',
            'repeat'        : '30'
        }
    }
};
