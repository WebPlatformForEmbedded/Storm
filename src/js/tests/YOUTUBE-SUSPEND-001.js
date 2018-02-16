/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'             : 'YouTube Suspend/Resume robustness test',
    'description'       : 'Suspends and Resumes YouTube plugin repeatedly and checks if everything is started correctly',
    'requiredPlugins'   : ['YouTube'],
    'steps'             : {
        'step1' : {
            'description'   : 'Stop WPEWebkit, Netflix & YouTube',
            'timeout'       : 180, //seconds
            'test'          : stopPlugins,
            'params'        : ['WebKitBrowser', 'Netflix', 'YouTube'],
        },
        'step2' : {
            'sleep'         : 10,
            'description'   : 'Check if YouTube is stopped correctly',
            'timeout'       : 180, //seconds
            'test'          : getPluginState,
            'params'        : 'YouTube',
            'assert'        : 'deactivated'
        },
        'step3' : {
            'description'   : 'Start YouTube',
            'timeout'       : 180,
            'test'          : startPlugin,
            'params'        : 'YouTube',
            'validate'      : httpResponseSimple
        },
        'step4' : {
            'description'   : 'Set the YouTube url',
            'timeout'       : 180,
            'test'          : setYouTubeUrl,
            'params'        : 'http://www.YouTube.com/tv',
            'validate'      : httpResponseSimple,
        },
        'step5' : {
            'sleep'         : 20,
            'description'   : 'Check if YouTube is started correctly',
            'timeout'       : 180, //seconds
            'test'          : getPluginState,
            'params'        : 'YouTube',
            'validate'      : checkResumedOrActivated,
        },
        'step6' : {
            'sleep'         : 5,
            'description'   : 'Suspend YouTube plugin',
            'timeout'       : 180,
            'test'          : suspendPlugin,
            'params'        : 'YouTube',
            'validate'      : httpResponseSimple,
        },
        'step7' : {
            'sleep'         : 20,
            'description'   : 'Resume YouTube plugin',
            'timeout'       : 180,
            'test'          : resumePlugin,
            'params'        : 'YouTube',
            'validate'      : httpResponseSimple,
        },
        'step8' : {
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
            'goto'          : 'step6',
            'repeat'        : '30'
        }
    },
    'cleanup'       : restartFramework
};
