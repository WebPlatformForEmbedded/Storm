/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'         : 'OpenCDMi startup robustness test',
    'description'   : 'Starts and stops the OpenCDMi plugin repeatedly and checks if everything is started correctly',
    'requiredPlugins': ['OpenCDMi'],
    'steps'         : {
        'step1' : {
            'description'   : 'Stop OpenCDMi',
            'test'          : stopPlugin,
            'params'        : 'OpenCDMi',
            'validate'      : httpResponseSimple,
        },
        'step2' : {
            'sleep'         : 10,
            'description'   : 'Check if OpenCDMi is stopped correctly',
            'test'          : getPluginState,
            'params'        : 'OpenCDMi',
            'assert'        : 'deactivated'
        },
        'step3' : {
            'description'   : 'Check if OpenCDMiImplementation rpcprocess is gone',
            'test'          : checkIfProcessIsRunning,
            'params'        : 'OpenCDMiImplementation',
            'assert'        : false
        },
        'step4' : {
            'description'   : 'Start OpenCDMi',
            'test'          : startAndResumePlugin,
            'params'        : 'OpenCDMi',
            'validate'      : httpResponseSimple,
        },
        'step5' : {
            'sleep'         : 10,
            'description'   : 'Check if OpenCDMi is started correctly',
            'test'          : getPluginState,
            'params'        : 'OpenCDMi',
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
