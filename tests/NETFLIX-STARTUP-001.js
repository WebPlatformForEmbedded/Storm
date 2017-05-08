/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'         : 'Netflix startup robustness test',
    'description'   : 'Starts and stops the Netflix plugin repeatedly and checks if everything is started correctly',
    'requiredPlugins'   : ['Netflix'],
    'steps'         : {
        'step1' : {
            'description'   : 'Stop WPEWebkit, YouTube & Netflix',
            'timeout'       : 180, //seconds
            'test'          : stopPlugins,
            'params'        : ['WebKitBrowser', 'YouTube', 'Netflix'],
        },
        'step2' : {
            'sleep'         : 20,
            'description'   : 'Check if Netflix is stopped correctly',
            'timeout'       : 180, //seconds
            'test'          : getPluginState,
            'params'        : 'Netflix',
            'assert'        : 'deactivated'
        },
        'step3' : {
            'description'   : 'Check if NetflixImplementation rpcprocess is gone',
            'test'          : checkIfProcessIsRunning,
            'params'        : 'NetflixImplementation',
            'assert'        : false
        },
        'step4' : {
            'description'   : 'Start Netflix',
            'timeout'       : 180,
            'test'          : startPlugin,
            'params'        : 'Netflix',
            'validate'      : httpResponseSimple
        },
        'step5' : {
            'sleep'         : 30,
            'description'   : 'Check if Netflix is started correctly',
            'timeout'       : 180, //seconds
            'test'          : getPluginState,
            'params'        : 'Netflix',
            'validate'      : checkResumedOrActivated,
        },
        'step6' : {
            'sleep'         : 5,
            'description'   : 'Check CPU load',
            'timeout'       : 180, //seconds
            'test'          : getCpuLoad,
            'validate'      : (cpuLoad) => {
                if (cpuLoad > 90)
                    return false;
                else
                    return true;
            }
        },
        'step7' : {
            'description'   : 'Repeat',
            'goto'          : 'step1',
            'repeat'        : '30'
        }
    }
};
