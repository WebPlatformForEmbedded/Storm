/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'         : 'Framework Controller test 02',
    'description'   : 'Tests start/stop functionality of the controller module',
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
                var resp = JSON.parse(task.steps.step1.response.body);

                var pluginsToTry = [ 'DeviceInfo', 'Monitor', 'Tracing' ];

                for (var i=0; i < resp.plugins.length; i++) {
                    if (pluginsToTry.indexOf( resp.plugins[i].callsign ) != -1) {
                        task.plugin = resp.plugins[i].callsign;
                        console.log('Selected ' + task.plugin);
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
            'test'          : (cb) => { stopPlugin(task.plugin, cb); },
            'validate'      : httpResponseSimple
        },
        'step4' : {
            'description'   : 'Check if plugin is stopped',
            'sleep'         : 10,
            'timeout'       : 20, //seconds
            'test'          : (cb) => { getPluginState(task.plugin, cb); },
            'assert'        : 'deactivated'
        },
        'step5' : {
            'description'   : 'Start plugin',
            'timeout'       : 180, //seconds
            'test'          : (cb) => { startPlugin(task.plugin, cb); },
            'validate'      : httpResponseSimple
        },
        'step6' : {
            'description'   : 'Check if plugin is started',
            'sleep'         : 10,
            'timeout'       : 20, //seconds
            'test'          : (cb) => { getPluginState(task.plugin, cb); },
            'assert'        : 'activated'
        },
    },
    'cleanup'       : restartFramework
};
