/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'             : 'Framework snapshot test',
    'description'       : 'Tests if the Framework snapshot module works by updating the WPEWebkit and checking if it changed',
    'requiredPlugins'   : ['Snapshot'],
    'screenshot'        : undefined,
    'steps'         : {
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
            'description'   : 'Set a URL at WPEWebkit',
            'test'          : setUrl,
            'params'        : 'http://www.metrological.com',
            'validate'      : httpResponseSimple
        },
        'step9' : {
            'sleep'         : 10,
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
        'step10' : {
            'description'   : 'Set another URL at WPEWebkit',
            'test'          : setUrl,
            'params'        : 'http://www.google.com',
            'validate'      : httpResponseSimple
        },
        'step11' : {
            'sleep'         : 10,
            'description'   : 'Get another screenshot and check if it changed',
            'test'          : screenshot,
            'validate'      : (resp) => {
                if (task.screenshot !== undefined && resp !== undefined && resp.length > 0 && task.screenshot.equals(resp) === false){
                    return true;
                } else {
                    throw new Error('Screenshot did not change or empty response');
                }
            }
        },
        'step12' : {
            'description'   : 'Set browser to about:blank',
            'test'          : setUrl,
            'params'        : 'about:blank',
            'validate'      : httpResponseSimple
        },
        'step13' : {
            'sleep'         : 10,
            'description'   : 'Get a screenshot',
            'test'          : screenshot,
            'validate'      : (resp) => {
                if (resp !== undefined && resp.length > 0){
                    task.screenshot = resp;
                    return true;
                } else {
                    throw new Error('');
                }
            }
        },
        'step14' : {
            'sleep'         : 5,
            'description'   : 'Take another screenshot, screen should be the same',
            'test'          : screenshot,
            'validate'      : (resp) => {
                if (task.screenshot !== undefined && resp !== undefined && resp.length > 0 && task.screenshot.equals(resp) === true){
                    return true;
                } else {
                    throw new Error('Screenshot changed or empty response');
                }
            }
        }
    },
    'cleanup'       : restartFramework
};
