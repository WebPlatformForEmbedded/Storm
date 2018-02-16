/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'             : 'WPEWebkit startup robustness test',
    'description'       : 'Starts and stops the WPEWebkit plugin repeatedly and checks if everything is started correctly',
    'requiredPlugins'   : ['WebKitBrowser'],
    'steps'         : {
        'step1' : {
            'description'   : 'Stop WPEWebkit',
            'test'          : stopPlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple,
        },
        'step2' : {
            'sleep'         : 30,
            'description'   : 'Check if WPEWebkit is stopped correctly',
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'assert'        : 'deactivated'
        },
        'step3' : {
            'description'   : 'Check if WebKitImplementation rpcprocess is gone',
            'test'          : checkIfProcessIsRunning,
            'params'        : 'WebKitImplementation',
            'assert'        : false
        },
        'step4' : {
            'description'   : 'Start WPEWebkit',
            'test'          : startAndResumePlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple
        },
        'step5' : {
            'sleep'         : 30,
            'description'   : 'Check if WPEWebkit is started correctly',
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'validate'      : checkResumedOrActivated,
        },
        'step6' : {
            'sleep'         : 5,
            'description'   : 'Check CPU load',
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
