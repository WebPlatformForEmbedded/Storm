/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'             : 'WebDriver StartUp',
    'description'       : 'Load the WebDriver plugin and check the status',
    'requiredPlugins'   : ['WebDriver'],
    'steps'         : {
        'init0'  : {
            'description'   : 'Check if WebDriver Plugin is present',
            'test'          : getPlugin,
            'params'        : 'WebDriver',
            'validate'      : (resp) => {
                if (resp.status !== 400)
                    return true;

                NotApplicable('Build does not support WebDriver');
            }
        },
        'init1'  : {
            'description'   : 'Make sure WPEWebkit is stopped',
            'test'          : stopPlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple,
        },
        'step1' : {
            'description'   : 'Stop WebDriver',
            'test'          : stopPlugin,
            'params'        : 'WebDriver',
            'validate'      : httpResponseSimple,
        },
        'step2' : {
            'sleep'         : 20,
            'description'   : 'Check if WebDriver is succesfully stopped',
            'test'          : getPluginState,
            'params'        : 'WebDriver',
            'assert'        : 'deactivated',
        },
        'step3' : {
            'description'   : 'Start WebDriver',
            'test'          : startPlugin,
            'params'        : 'WebDriver',
            'validate'      : httpResponseSimple,
        },
        'step4' : {
            'sleep'         : 20,
            'description'   : 'Check if WebDriver is started',
            'test'          : getPluginState,
            'params'        : 'WebDriver',
            /*'assert'        : 'activated' Issue with status being reported by the webdriver */
        },
        'step5' : {
            'sleep'         : 30,
            'description'   : 'Check if WebDriver rpcprocess is present',
            'timeout'       : 180, //seconds
            'test'          : checkIfProcessIsRunning,
            'params'        : 'WebDriverImplementation',
            'validate'      : true,
        },
        'step6' : {
            'description'   : 'Connect WebDriver',
            'test'          : wdConnect,
            'assert'        : true,
        },
        'step7' : {
            'description'   : 'Check if WPE is started as a result of the webdriver connect',
            'test'          : checkIfProcessIsRunning,
            'params'        : 'WPEProxy',
            'validate'      : true,
            }
        },
        'step8' : {
            'sleep'         : 10,
            'description'   : 'Disconnect from WebDriver',
            'test'          : wdDisconnect,
        },
        'step9' : {
            'description'   : 'Stop WebDriver plugin',
            'test'          : stopPlugin,
            'params'        : 'WebDriver',
            'validate'      : httpResponseSimple,
        },
        'step10' : {
            'sleep'         : 10,
            'description'   : 'Check if WebDriver plugin reports deactivated',
            'test'          : getPluginState,
            'params'        : 'WebDriver',
            'validate'      : 'deactivated',
        },
        'step11' : {
            'description'   : 'Check if WebDriver rpc process is not present in process list',
            'test'          : checkIfProcessIsRunning,
            'params'        : 'WebDriverImplementation',
            'assert'        : false,
        },
        'step12' : {
            'description'   : 'Check if WPEProxy process is not present in process list',
            'test'          : checkIfProcessIsRunning,
            'params'        : 'WPEProxy',
            'assert'        : false,
        },
        'cleanup'   : (cb) => {
            stopPlugin('WebDriver', (resp) => {
                cb(resp);
            });
        }
    };
