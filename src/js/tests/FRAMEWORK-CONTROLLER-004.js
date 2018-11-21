/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'         : 'Framework Controller test 04',
    'description'   : 'Tests for duplicate plugins in controller module',
    'plugins'       : [],
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
                var x = JSON.parse(task.steps.step1.response.body);

                for (var i=0; i<x.plugins.length; i++) {
                    var module = x.plugins[i].callsign;
                    task.plugins.push(module);
                }
                console.log(task.plugins);
                cb();
            },
        },
        'step3' : {
            'description'   : 'Check for duplicate plugins in response',
            'timeout'       : 180, //seconds
            'test'          : function(cb){
                console.log(task.plugins.length);
                for (var i=0; i<task.plugins.length; i++) {
                    var y = task.plugins.pop(task.plugins[i]);
                    var z = task.plugins.indexOf(y);
                    console.log(y, z);

                    if (z !== -1)
                        throw new Error('Duplicate plugin found in response');
                }
                cb(true);
            },
            'assert'        : true
        }
    },
    'cleanup'       : restartFramework
};
