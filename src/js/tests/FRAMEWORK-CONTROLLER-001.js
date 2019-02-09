/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'         : 'Framework Controller test 01',
    'description'   : 'Tests basic functionality of the controller module',
    'steps'         : {
        'step1' : {
            'description'   : 'Get /Service/Controller and validate response',
            'timeout'       : 180, //seconds
            'test'          : getPlugin,
            'params'        : 'Controller',
            'validate'      : (response) => {
                if (response.body === undefined)
                    return false;

                var responseObject = JSON.parse(response.body);
                return true;
            },
        },
        'step2' : {
            'description'   : 'Check for mandatory elements in response',
            'timeout'       : 180, //seconds
            'test'          : function(cb){
                var obj = JSON.parse( getResponseByStep('step1').body );

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
                var obj = JSON.parse( getResponseByStep('step1').body );

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
        }
    }
};
