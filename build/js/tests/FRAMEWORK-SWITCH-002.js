/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'             : 'WPEWebkit/Netflix switch robustness test',
    'description'       : 'Switches between Netflix/WPEWebkit and checks if everything is started and suspended correctly',
    'requiredPlugins'   : ['Switch', 'Netflix', 'WebKitBrowser'],
    'steps'         : {
        'init1' : {
            'description'   : 'Stop YouTube Netflix & WPEWebkit',
            'timeout'       : 180, //seconds
            'test'          : stopPlugins,
            'params'        : ['YouTube', 'Netflix', 'WebKitBrowser'],
            'validate'      : httpResponseSimple,
        },
        'init2' : {
            'sleep'         : 10,
            'description'   : 'Check if Netflix is succesfully stopped',
            'timeout'       : 30, //seconds
            'test'          : getPluginState,
            'params'        : 'Netflix',
            'assert'        : 'deactivated',
        },
        /* WPEWebkit currently restarts automatically when deactivated
        init3' : {
            'sleep'         : 10,
            'description'   : 'Check if WPEWebkit  is succesfully stopped',
            'timeout'       : 30, //seconds
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'assert'        : 'deactivated'
        },*/
        'init4' : {
            'sleep'         : 10,
            'description'   : 'Check if WPEWebkit is started',
            'timeout'       : 180, //seconds
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'validate'      : checkResumedOrActivated,
        },
        'step1' : {
            'sleep'         : 10,
            'description'   : 'Switch to Netflix',
            'timeout'       : 180, //seconds
            'test'          : switchPlugin,
            'params'        : 'Netflix',
            'validate'      : httpResponseSimple,
        },
        'step2' : {
            'sleep'         : 10,
            'description'   : 'Check if Netflix is activated',
            'timeout'       : 180,
            'test'          : getPluginState,
            'params'        : 'Netflix',
            'validate'      : checkResumedOrActivated,
        },
        'step3' : {
            'sleep'         : 10,
            'description'   : 'Check if WPEWebkit is deactivated/suspended',
            'timeout'       : 180,
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'validate'      : checkSuspendedOrDeactivated,
        },
        'step4' : {
            'sleep'         : 10,
            'description'   : 'Switch to WPEWebkit',
            'timeout'       : 180, //seconds
            'test'          : switchPlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple,
        },
        'step5' : {
            'sleep'         : 10,
            'description'   : 'Check if WPEWebkit is started',
            'timeout'       : 180, //seconds
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'validate'      : checkResumedOrActivated,
        },
        'step6' : {
            'sleep'         : 10,
            'description'   : 'Check if Netflix is deactivated',
            'timeout'       : 30, //seconds
            'test'          : getPluginState,
            'params'        : 'Netflix',
            'assert'        : 'deactivated',
        },
        'step7' : {
            'description'   : 'Repeat',
            'goto'          : 'step1',
            'repeat'        : '30'
        }
    }
};
