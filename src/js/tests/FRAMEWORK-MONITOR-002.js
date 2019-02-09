/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'             : 'Framework Monitor tests',
    'description'       : 'Tests if the Framework Monitor module return measurement values for WebKitBrowser',
    'requiredPlugins'   : ['Monitor', 'WebKitBrowser'],
    'steps'         : {
        'step1' : {
            'description'   : 'Stop Monitor module',
            'test'          : stopPlugin,
            'params'        : 'Monitor',
            'validate'      : httpResponseSimple,
        },
        'step2' : {
            'sleep'         : 10,
            'description'   : 'Check if Monitor is stopped succesfully',
            'test'          : getPluginState,
            'params'        : 'Monitor',
            'assert'        : 'deactivated'
        },
        'step3' : {
            'description'   : 'Start Monitor module',
            'test'          : startPlugin,
            'params'        : 'Monitor',
            'validate'      : httpResponseSimple,
        },
        'step4' : {
            'sleep'         : 10,
            'description'   : 'Check if Monitor is started succesfully',
            'test'          : getPluginState,
            'params'        : 'Monitor',
            'assert'        : 'activated'
        },
        'step5' : {
            'description'   : 'Get Plugin Data',
            'test'          : getPlugin,
            'params'        : 'Monitor',
            'validate'      : (resp) => {
                var monitor = JSON.parse(resp.body);

                console.log(monitor[0].name);
                if (monitor[0].measurement === undefined)
                    throw new Error('Monitor measurement data is not present for WebKitBrowser');
                return true;
            }
        }
    },
    'cleanup'       : restartFramework
};