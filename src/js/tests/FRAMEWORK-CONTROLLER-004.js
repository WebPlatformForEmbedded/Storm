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
                var x = JSON.parse(test.steps.step1.response.body);

                for (var i=0; i<x.plugins.length; i++) {
                    var module = x.plugins[i].callsign;
                    test.plugins.push(module);
                }
                console.log(test.plugins);
                cb();
            },
        },
        'step3' : {
            'description'   : 'Check for duplicate plugins in response',
            'timeout'       : 180, //seconds
            'test'          : function(cb){
                console.log(test.plugins.length);
                for (var i=0; i<test.plugins.length; i++) {
                    var y = test.plugins.pop(test.plugins[i]);
                    var z = test.plugins.indexOf(y);
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
