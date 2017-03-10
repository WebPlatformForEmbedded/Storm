Ï/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'         : 'Framework Controller test 01',
    'description'   : 'Tests basic functionality of the controller module',
    'steps'         : {
        'step1' : {
            'description'   : 'Get /Service/Controller',
            'timeout'       : 180, //seconds
            'test'          : getPlugin,
            'params'        : 'Controller',
            'validate'      : httpResponseBody,
        },
        'step2' : {
            'description'   : 'Check if response is a JSON response',
            'timeout'       : 180, //seconds
            'test'          : function(cb) {
                var y = JSON.parse(task.steps.step1.response.body);

                if (typeof y === 'object'){
                    task.steps.step2.result = y;
                    cb(true);
                } else {
                    cb(false);
                }
            },
            'assert'        : true
        },
        'step3' : {
            'description'   : 'Check for mandatory elements in response',
            'timeout'       : 180, //seconds
            'test'          : function(cb){
                var obj = task.steps.step2.result;
                if (obj.plugins !== undefined && obj.plugins.length > 0) {
                    if (obj.server !== undefined && obj.channel !== undefined) {
                        cb(true);
                    } else {
                        msg = 'Server of Channel object not found';
                        cb(false);
                    }
                } else {
                    msg = 'Plugins not found';
                    cb(false);
                }
            },
            'assert'        : true
        },
        'step4' : {
            'description'   : 'Check for mandatory elements in plugins list',
            'timeout'       : 10,
            'test'          : function(cb) {
                var obj = task.steps.step2.result;
                if (obj.plugins === undefined) cb(false);

                for (var i=0; i < obj.plugins.length; i++) {
                    var plugin = obj.plugins[i];
                    if ( (plugin.callsign === undefined) || (plugin.locator === undefined) || (plugin.state === undefined) ) {
                        cb(false);
                        break;
                    }

                    if (i === obj.plugins.length-1) cb(true);
                }
            }
        },
        'step5' : {
            'description'   : 'Controller should return a UI',
            'timeout'       : 180, //seconds
            'test'          : http,
            'params'        : { url: `http://${host}:80/Service/Controller/UI`, method: 'GET' },
            'validate'      : httpResponseBody
        }
    },
    'cleanup'       : restartFramework
};
