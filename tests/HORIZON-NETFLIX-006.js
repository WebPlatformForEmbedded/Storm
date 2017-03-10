/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

if (devicetype !== 'horizon')
    NotApplicable('This test only applies to a Horizon device');

module.exports = {
    'title'         : 'Horizon Netflix gallery navigation',
    'description'   : 'navigating through the gallery up/down/right/left',
    'steps'         : {
        'init0'  : {
            'description'   : 'Check if Netflix Plugin is present',
            'test'          : getPlugin,
            'params'        : 'Netflix',
            'validate'      : (resp) => {
                if (resp.status !== 400)
                    return true;

                NotApplicable('Build does not support Netflix');
            }
        },
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
            'description'   : 'Press ok to select profile',
            'test'          : key,
            'params'        : ok,
        },
        'step9' : {
            'sleep'         : 10,
            'description'   : 'Press down',
            'test'          : key,
            'params'        : down,
        },
        'step10' : {
            'description'   : 'Press right',
            'test'          : key,
            'params'        : right,
        },
        'step11' : {
            'description'   : 'Press right',
            'test'          : key,
            'params'        : right,
        },
        'step12' : {
            'description'   : 'Press right',
            'test'          : key,
            'params'        : right,
        },
        'step13' : {
            'description'   : 'Press right',
            'test'          : key,
            'params'        : right,
        },
        'step14' : {
            'description'   : 'Press down',
            'test'          : key,
            'params'        : down,
        },
        'step15' : {
            'description'   : 'Press down',
            'test'          : key,
            'params'        : down,
        },
        'step16' : {
            'description'   : 'Press down',
            'test'          : key,
            'params'        : down,
        },
        'step17' : {
            'description'   : 'Press down',
            'test'          : key,
            'params'        : down,
        },
        'step18' : {
            'description'   : 'Repeat',
            'goto'          : 'step10',
            'repeat'        : '100'
        }
    }
};
