/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

if (devicetype !== 'horizon')
    NotApplicable('This test only applies to a Horizon device');

module.exports = {
    'title'             : 'Horizon Netflix Pause/Resume playback',
    'description'       : 'Pause/resume multiple times on a Netflix video',
    'requiredPlugins'   : ['Netflix'],
    'steps'         : {
        'init1' : {
            'description'   : 'Stop Netflix',
            'test'          : stopPlugin,
            'params'        : 'Netflix',
            'validate'      : httpResponseSimple,
        },
        'init2' : {
            'sleep'         : 20,
            'description'   : 'Start Netflix',
            'test'          : startPlugin,
            'params'        : 'Netflix',
            'validate'      : httpResponseSimple,
        },
        'init3' : {
            'description'   : 'Press 1 to force Cisco to go to the channel bar',
            'test'          : key,
            'params'        : one
        },
        'step1' : {
            'sleep'         : 10,
            'description'   : 'Press menu',
            'test'          : key,
            'params'        : menu,
        },
        'step2' : {
            'sleep'         : 15,
            'description'   : 'Check if Netflix is active',
            'test'          : getPluginState,
            'params'        : 'Netflix',
            'validate'      : checkResumedOrActivated
        },
        'step3' : {
            'description'   : 'Press left to go to Library',
            'test'          : key,
            'params'        : left,
        },
        'step4' : {
            'sleep'         : 5,
            'description'   : 'Press ok to enter my Library',
            'test'          : key,
            'params'        : ok,
        },
        'step5' : {
            'sleep'         : 5,
            'description'   : 'Press left to select apps',
            'test'          : key,
            'params'        : left,
        },
        'step6' : {
            'sleep'         : 10,
            'description'   : 'Press ok to enter apps',
            'test'          : key,
            'params'        : ok,
        },
        'step7' : {
            'sleep'         : 15,
            'description'   : 'Press ok to enter Netflix app',
            'test'          : key,
            'params'        : ok,
        },
        'step8' : {
            'sleep'         : 10,
            'description'   : 'Press ok to select video',
            'test'          : key,
            'params'        : ok,
        },
        'step9' : {
            'sleep'         : 10,
            'description'   : 'Press ok',
            'test'          : key,
            'params'        : ok,
        },
        'step10' : {
            'sleep'         : 30,
            'description'   : 'Press ok to pause',
            'test'          : key,
            'params'        : ok,
        },
        'step11' : {
            'sleep'         : 10,
            'description'   : 'Press ok to resume',
            'test'          : key,
            'params'        : ok,
        },
        'step12' : {
            'description'   : 'Repeat',
            'goto'          : 'step10',
            'repeat'        : '30'
        }
    }
};
