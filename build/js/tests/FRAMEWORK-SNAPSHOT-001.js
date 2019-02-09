/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'             : 'Framework snapshot test',
    'description'       : 'Tests if the Framework snapshot module works',
    'requiredPlugins'   : ['Snapshot'],
    'screenshot'        : undefined,
    'steps'             : {
        'step1' : {
            'description'   : 'Stop Snapshot module',
            'test'          : stopPlugin,
            'params'        : 'Snapshot',
            'validate'      : httpResponseSimple,
        },
        'step2' : {
            'sleep'         : 10,
            'description'   : 'Check if Snapshot is stopped succesfully',
            'test'          : getPluginState,
            'params'        : 'Snapshot',
            'assert'        : 'deactivated'
        },
        'step3' : {
            'description'   : 'Start Snapshot module',
            'test'          : startPlugin,
            'params'        : 'Snapshot',
            'validate'      : httpResponseSimple,
        },
        'step4' : {
            'sleep'         : 10,
            'description'   : 'Check if Snapshot is started succesfully',
            'test'          : getPluginState,
            'params'        : 'Snapshot',
            'assert'        : 'activated'
        },
        'step5' : {
            'description'   : 'Get Plugin Data',
            'test'          : getPlugin,
            'params'        : 'Snapshot',
            'validate'      : httpResponseSimple
        },
        'step6' : {
            'description'   : 'Make sure the WPEWebkit is started',
            'test'          : startPlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple
        },
        'step7' : {
            'sleep'         : 30,
            'description'   : 'Check if WPEWebkit is activated',
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'validate'      : 'activated'
        },
        'step8' : {
            'description'   : 'Get a screenshot',
            'test'          : screenshot,
            'validate'      : (resp) => {
                if (resp === undefined || resp.length === 0) {
                    throw new Error('Error while reading snapshot from Framework');
                } else {
                    return true;
                }
            }
        }
    },
    'cleanup'       : restartFramework
};
