/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'             : 'Framework Device Info test',
    'description'       : 'Check if there is a valid IP returned',
    'requiredPlugins'   : ['DeviceInfo'],
    'plugin'            : '', //place holder to store selected plugin value
    'steps'             : {
        'step1' : {
            'description'   : 'Stop DeviceInfo plugin',
            'timeout'       : 60, //seconds
            'test'          : stopPlugin,
            'params'        : 'DeviceInfo',
            'validate'      : httpResponseSimple,
        },
        'step2' : {
            'description'   : 'Check if DeviceInfo plugin is stopped',
            'sleep'         : 20,
            'timeout'       : 60,
            'test'          : getPluginState,
            'params'        : 'DeviceInfo',
            'assert'        : 'deactivated'
        },
        'step3' : {
            'description'   : 'Start DeviceInfo plugin',
            'timeout'       : 10, //seconds
            'test'          : startPlugin,
            'params'        : 'DeviceInfo',
            'validate'        : httpResponseSimple
        },
        'step4' : {
            'description'   : 'Check if DeviceInfo plugin is started',
            'sleep'         : 20,
            'timeout'       : 60,
            'test'          : getPluginState,
            'params'        : 'DeviceInfo',
            'assert'        : 'activated'
        },
        'step5' : {
            'description'   : 'Get DeviceInfo data',
            'timeout'       : 10, //seconds
            'test'          : getPlugin,
            'params'        : 'DeviceInfo',
            'validate'      : (response) => {
                var d = JSON.parse(response.body);

                if (d.addresses !== undefined && d.addresses.length !== 0) {
                    for (var i=0; i<d.addresses.length; i++) {
                        var _interface = d.addresses[i];

                        if (_interface.name === undefined ||
                            _interface.mac  === undefined)
                            throw new Error('Error reading interface name or mac on interface idx: ' + i);

                        if (_interface.ip !== undefined && _interface.ip !== '127.0.0.1')
                            return true;

                        if (i == d.addresses.length-1)
                            throw new Error('No valid IP address found in Framework response'); 
                    }
                } else {
                    throw new Error('Error reading addresses object from DeviceInfo');
                }
            }
        },
    },
    'cleanup'       : restartFramework
};
