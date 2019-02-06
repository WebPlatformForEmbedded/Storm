/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'             : 'WebServer startup robustness test',
    'description'       : 'Starts and stops the webserver plugin repeatedly and checks if everything is started correctly',
    'requiredPlugins'   : ['WebServer'],
    'steps'             : {
        'step1' : {
            'description'   : 'Stop WebServer',
            'test'          : stopPlugin,
            'params'        : 'WebServer',
            'validate'      : httpResponseSimple,
        },
        'step2' : {
            'sleep'         : 30,
            'description'   : 'Check if WebServer is stopped correctly',
            'test'          : getPluginState,
            'params'        : 'WebServer',
            'assert'        : 'deactivated'
        },
        'step3' : {
            'description'   : 'Check if WebServerImplementation rpcprocess is gone',
            'test'          : checkIfProcessIsRunning,
            'params'        : 'WebServerImplementation',
            'assert'        : false
        },
        'step4' : {
            'description'   : 'Start WebServer',
            'test'          : startPlugin,
            'params'        : 'WebServer',
            'validate'      : httpResponseSimple
        },
        'step5' : {
            'sleep'         : 30,
            'description'   : 'Check if WebServer is started correctly',
            'test'          : getPluginState,
            'params'        : 'WebServer',
            'validate'      : checkResumedOrActivated
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
    },
    'cleanup'       : restartFramework
};
