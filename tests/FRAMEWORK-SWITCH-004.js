/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'         : 'YouTube/Netflix/WPEWebkit switch robustness test',
    'description'   : 'Switches between YouTube/Netflix/WPEWebkit and checks if everything is started and suspended correctly',
    'requiredPlugins'   : ['Switch', 'Netflix', 'YouTube', 'WebKitBrowser'],
    'steps'         : {
        'init2' : {
            'description'   : 'Stop YouTube, Netflix & WPEWebkit',
            'timeout'       : 180, //seconds
            'test'          : stopPlugins,
            'params'        : ['YouTube', 'Netflix', 'WebKitBrowser'],
            'validate'      : httpResponseSimple,
        },
        'init3' : {
            'sleep'         : 10,
            'description'   : 'Check if YouTube is succesfully stopped',
            'timeout'       : 30, //seconds
            'test'          : getPluginState,
            'params'        : 'YouTube',
            'assert'        : 'deactivated',
        },
        'init4' : {
            'sleep'         : 10,
            'description'   : 'Check if Netflix is succesfully stopped',
            'timeout'       : 30, //seconds
            'test'          : getPluginState,
            'params'        : 'Netflix',
            'assert'        : 'deactivated',
        },
        /* WPEWebkit currently restarts automatically when deactivated
        'init5' : {
            'sleep'         : 10,
            'description'   : 'Check if WPEWebkit is succesfully stopped',
            'timeout'       : 30, //seconds
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'assert'        : 'deactivated'
        },*/
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
            'description'   : 'Check if Netflix is started',
            'timeout'       : 180, //seconds
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
            'description'   : 'Switch to YouTube',
            'timeout'       : 180, //seconds
            'test'          : switchPlugin,
            'params'        : 'YouTube',
            'validate'      : httpResponseSimple,
        },
        'step5' : {
            'description'   : 'Set the YouTube url',
            'timeout'       : 180,
            'test'          : setYouTubeUrl,
            'params'        : 'http://www.youtube.com/tv',
            'validate'      : httpResponseSimple,
        },
        'step6' : {
            'sleep'         : 10,
            'description'   : 'Check if YouTube is activated',
            'timeout'       : 180,
            'test'          : getPluginState,
            'params'        : 'YouTube',
            'validate'      : checkResumedOrActivated,
        },
        'step7' : {
            'sleep'         : 10,
            'description'   : 'Check if Netflix is deactivated',
            'timeout'       : 180,
            'test'          : getPluginState,
            'params'        : 'Netflix',
            'validate'      : checkSuspendedOrDeactivated,
        },
        'step8' : {
            'description'   : 'Switch to WPEWebkit',
            'timeout'       : 180, //seconds
            'test'          : switchPlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple,
        },
        'step9' : {
            'sleep'         : 10,
            'description'   : 'Check if WPEWebkit is started',
            'timeout'       : 180, //seconds
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'validate'      : checkResumedOrActivated,
        },
        'step10' : {
            'sleep'         : 10,
            'description'   : 'Check if YouTube is deactivated',
            'timeout'       : 180,
            'test'          : getPluginState,
            'params'        : 'YouTube',
            'validate'      : checkSuspendedOrDeactivated,
        },
        'step11' : {
            'description'   : 'Repeat',
            'goto'          : 'step1',
            'repeat'        : '30',
        }
    }
};
