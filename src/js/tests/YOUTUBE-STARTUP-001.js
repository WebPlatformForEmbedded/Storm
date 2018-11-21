/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'             : 'YouTube startup robustness test',
    'description'       : 'Starts and stops the YouTube plugin repeatedly and checks if everything is started correctly',
    'requiredPlugins'   : ['WebKitBrowser', 'YouTube'],
    'steps'             : {
        'step1' : {
            'description'   : 'Stop WPEWebkit, Netflix & YouTube',
            'timeout'       : 180, //seconds
            'test'          : stopPlugins,
            'params'        : ['WebKitBrowser', 'Netflix', 'YouTube'],
        },
        'step2' : {
            'sleep'         : 20,
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
            'params'        : 'http://www.youtube.com/tv',
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
