/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'             : 'Netflix Suspend/Resume robustness test',
    'description'       : 'Suspends and Resumes Netflix plugin repeatedly and checks if everything is started correctly',
    'requiredPlugins'   : ['Netflix'],
    'steps'             : {
        'step1' : {
            'description'   : 'Stop WPEWebkit, Netflix & YouTube',
            'timeout'       : 180, //seconds
            'test'          : stopPlugins,
            'params'        : ['WebKitBrowser', 'Netflix', 'YouTube'],
        },
        'step2' : {
            'sleep'         : 10,
            'description'   : 'Check if Netflix is stopped correctly',
            'timeout'       : 180, //seconds
            'test'          : getPluginState,
            'params'        : 'Netflix',
            'assert'        : 'deactivated'
        },
        'step3' : {
            'description'   : 'Start Netflix',
            'timeout'       : 180,
            'test'          : startAndResumePlugin,
            'params'        : 'Netflix',
            'validate'      : httpResponseSimple
        },
        'step4' : {
            'sleep'         : 20,
            'description'   : 'Check if Netflix is started correctly',
            'timeout'       : 180, //seconds
            'test'          : getPluginState,
            'params'        : 'Netflix',
            'validate'      : checkResumedOrActivated,
        },
        'step5' : {
            'sleep'         : 5,
            'description'   : 'Suspend Netflix plugin',
            'timeout'       : 180,
            'test'          : suspendPlugin,
            'params'        : 'Netflix',
            'validate'      : httpResponseSimple,
        },
        'step6' : {
            'sleep'         : 20,
            'description'   : 'Resume Netflix plugin',
            'timeout'       : 180,
            'test'          : resumePlugin,
            'params'        : 'Netflix',
            'validate'      : httpResponseSimple,
        },
        'step7' : {
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
        'step8' : {
            'description'   : 'Repeat',
            'goto'          : 'step5',
            'repeat'        : '30'
        }
    },
    'cleanup'       : restartFramework
};
