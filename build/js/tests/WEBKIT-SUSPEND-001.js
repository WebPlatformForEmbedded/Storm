/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'             : 'WPEWebkit Suspend/Resume robustness test',
    'description'       : 'Suspends and Resumes WPEWebkit plugin repeatedly and checks if everything is started correctly',
    'requiredPlugins'   : ['WebKitBrowser'],
    'steps'             : {
        'step1' : {
            'description'   : 'Stop WPEWebkit, Netflix & YouTube',
            'timeout'       : 180, //seconds
            'test'          : stopPlugins,
            'params'        : ['WebKitBrowser', 'Netflix', 'YouTube'],
        },
        'step2' : {
            'sleep'         : 10,
            'description'   : 'Check if WPEWebkit is stopped correctly',
            'timeout'       : 180, //seconds
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'assert'        : 'deactivated'
        },
        'step3' : {
            'description'   : 'Start WPEWebkit',
            'timeout'       : 180,
            'test'          : startAndResumePlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple
        },
        'step4' : {
            'sleep'         : 30,
            'description'   : 'Check if WPEWebkit is started correctly',
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'validate'      : checkResumedOrActivated,
        },
        'step5' : {
            'sleep'         : 5,
            'description'   : 'Suspend WPEWebkit plugin',
            'timeout'       : 180,
            'test'          : suspendPlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple,
        },
        'step6' : {
            'sleep'         : 20,
            'description'   : 'Resume WPEWebkit plugin',
            'timeout'       : 180,
            'test'          : resumePlugin,
            'params'        : 'WebKitBrowser',
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
