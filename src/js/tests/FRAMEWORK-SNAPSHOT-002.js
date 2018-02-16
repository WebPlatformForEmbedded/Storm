/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'             : 'Framework snapshot test with multiple start/stops',
    'description'       : 'Tests if the Framework snapshot module works',
    'requiredPlugins'   : ['Snapshot'],
    'screenshot'        : undefined,
    'steps'         : {
        'init2' : {
            'description'   : 'Make sure the WPEWebkit is started',
            'test'          : startPlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple
        },
        'init3' : {
            'description'   : 'Check if WPEWebkit is activated',
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'validate'      : 'activated'
        },
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
            'description'   : 'Get a screenshot',
            'test'          : screenshot,
            'validate'      : (resp) => {
                if (resp === undefined || resp.length === 0) {
                    throw new Error('Error while reading snapshot from Framework');
                } else {
                    task.screenshot = resp;
                    return true;
                }
            }
        },
        'step7' : {
            'description'   : 'Repeat this 30 times',
            'goto'          : 'step1',
            'repeat'        : 30
        }
    },
    'cleanup'       : restartFramework
};
