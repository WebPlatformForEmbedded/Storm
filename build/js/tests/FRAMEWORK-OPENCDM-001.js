/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'         : 'OCDM startup robustness test',
    'description'   : 'Starts and stops the OCDM plugin repeatedly and checks if everything is started correctly',
    'requiredPlugins': ['OCDM'],
    'steps'         : {
        'step1' : {
            'description'   : 'Stop OCDM',
            'test'          : stopPlugin,
            'params'        : 'OCDM',
            'validate'      : httpResponseSimple,
        },
        'step2' : {
            'sleep'         : 10,
            'description'   : 'Check if OCDM is stopped correctly',
            'test'          : getPluginState,
            'params'        : 'OCDM',
            'assert'        : 'deactivated'
        },
        'step3' : {
            'description'   : 'Check if OCDMImplementation rpcprocess is gone',
            'test'          : checkIfProcessIsRunning,
            'params'        : 'OCDMImplementation',
            'assert'        : false
        },
        'step4' : {
            'description'   : 'Start OCDM',
            'test'          : startAndResumePlugin,
            'params'        : 'OCDM',
            'validate'      : httpResponseSimple,
        },
        'step5' : {
            'sleep'         : 10,
            'description'   : 'Check if OCDM is started correctly',
            'test'          : getPluginState,
            'params'        : 'OCDM',
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
    },
    'cleanup'       : restartFramework
};
