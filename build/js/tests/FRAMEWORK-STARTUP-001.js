/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'         : 'Framework startup robustness test',
    'description'   : 'Starts and stops Framework repeatedly and checks if everything is started correctly',
    'steps'         : {
        'init2' : {
            'description'   : 'Stop Netflix',
            'timeout'       : 180, //seconds
            'test'          : stopPlugin,
            'params'        : 'Netflix',
        },
        'init3' : {
            'description'   : 'Stop YouTube',
            'timeout'       : 180, //seconds
            'test'          : stopPlugin,
            'params'        : 'YouTube',
        },
        'step1' : {
            'description'   : 'Stop Framework',
            'timeout'       : 180, //seconds
            'test'          : stopFramework,
            'assert'        : true,
        },
        'step2' : {
            'sleep'         : 30,
            'description'   : 'Check if Framework is stopped correctly',
            'timeout'       : 180, //seconds
            'test'          : checkIfProcessIsRunning,
            'params'        : 'WPEFramework',
            'assert'        : false
        },
        'step3' : {
            'description'   : 'Check if WPEProcess is stopped correctly',
            'timeout'       : 180,
            'test'          : checkIfProcessIsRunning,
            'params'        : 'WPEProcess',
            'assert'        : false
        },
        'step4' : {
            'description'   : 'Start Framework',
            'timeout'       : 180,
            'test'          : startFramework,
            'assert'        : true
        },
        'step5' : {
            'sleep'         : 30,
            'description'   : 'Check if Framework responds',
            'timeout'       : 180,
            'test'          : getPlugin,
            'params'        : 'Controller',
            'validate'      : httpResponseBody
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
            'repeat'        : '100'
        }
    },
    'cleanup'       : restartFramework
};
