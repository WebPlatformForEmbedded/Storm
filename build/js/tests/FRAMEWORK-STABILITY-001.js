/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'         : 'Framework Controller Robustness test',
    'description'   : 'Tests start/stop functionality of the controller module and repeats 100 times',
    'plugin'        : '', //place holder to store selected plugin value
    'steps'         : {
        'step1' : {
            'description'   : 'Get Controller plugin data',
            'timeout'       : 180, //seconds
            'test'          : getPlugin,
            'params'        : 'Controller',
            'validate'      : httpResponseBody,
        },
        'step2' : {
            'description'   : 'Select a plugin from plugin list',
            'timeout'       : 10, //seconds
            'test'          : function(cb) {
                var resp = JSON.parse(test.steps.step1.response.body);

                var pluginsToTry = [ 'DeviceInfo', 'Monitor', 'Tracing' ];

                for (var i=0; i < resp.plugins.length; i++) {
                    if (pluginsToTry.indexOf( resp.plugins[i].callsign ) != -1) {
                        test.plugin = resp.plugins[i].callsign;
                        console.log('Selected ' + test.plugin);
                        cb(true);
                        break;
                    }
                }
            },
            'assert'        : true
        },
        'step3' : {
            'description'   : 'Stop plugin',
            'timeout'       : 180, //seconds
            'test'          : (cb) => { stopPlugin(test.plugin, cb) },
            'validate'      : httpResponseSimple
        },
        'step4' : {
            'description'   : 'Check if plugin is stopped',
            'sleep'         : 10,
            'timeout'       : 20, //seconds
            'test'          : (cb) => { getPluginState(test.plugin, cb) },
            'assert'        : 'deactivated'
        },
        'step5' : {
            'description'   : 'Start plugin',
            'timeout'       : 180, //seconds
            'test'          : (cb) => { startPlugin(test.plugin, cb) },
            'validate'      : httpResponseSimple
        },
        'step6' : {
            'description'   : 'Check if plugin is started',
            'sleep'         : 10,
            'timeout'       : 20, //seconds
            'test'          : (cb) => { getPluginState(test.plugin, cb) },
            'assert'        : 'activated'
        },
        'step7' : {
            'description'   : 'Repeat start/stop, 100 times',
            'goto'          : 'step3',
            'repeat'        : 100,
        },
        'step8' : {
            'description'   : 'Check if Framework controller still responds',
            'timeout'       : 180, //seconds
            'test'          : getPlugin,
            'params'        : 'Controller',
            'validate'      : httpResponseBody,
        },
    },
    'cleanup'       : restartFramework
};
