/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'             : 'Framework snapshot test with no active components that render anything',
    'description'       : 'Tests if the Framework snapshot module works',
    'requiredPlugins'   : ['Snapshot'],
    'screenshot'        : undefined,
    'steps'             : {
        'init2' : {
            'description'   : 'Stop WPEWebkit',
            'test'          : stopPlugin,
            'params'        : 'WebKitBrowser',
        },
        'init3' : {
            'description'   : 'Stop Netflix',
            'test'          : stopPlugin,
            'params'        : 'Netflix',
        },
        'init4' : {
            'description'   : 'Stop YouTube',
            'test'          : stopPlugin,
            'params'        : 'YouTube',
        },
        'init5' : {
            'sleep'         : 30,
            'description'   : 'Make sure everything is stopped',
            'test'          : getPlugin,
            'params'        : 'Controller',
            'validate'      : (response) => {
                var resp = JSON.parse(response.body);

                for (var i=0; resp.plugins.length; i++) {
                    var currentPlugin = resp.plugins[i];
                    if (currentPlugin.callsign === 'Netflix' && currentPlugin.state === 'activated')
                        throw new Error('Netflix did not deactivate');

                    if (currentPlugin.callsign === 'WebKitBrowser' && currentPlugin.state === 'activated')
                        throw new Error('WPEWebkit did not deactivate');

                    if (currentPlugin.callsign === 'YouTube' && currentPlugin.state === 'activated')
                        throw new Error('YouTube did not deactivate');

                    if (i === resp.plugins.length-1)
                        return true;
                }
            }
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
            'description'   : 'Get a screenshot',
            'test'          : screenshot,
            'validate'      : (resp) => {
                if (resp !== undefined)
                    return true;
                else
                    throw new Error('Error retrieving snapshot');

            }
        },
        'step6' : {
            'description'   : 'Check if Framework/snapshot still responds',
            'test'          : getPluginState,
            'params'        : 'Snapshot',
            'validate'      : 'activated'
        }
    },
    'cleanup'       : restartFramework
};
