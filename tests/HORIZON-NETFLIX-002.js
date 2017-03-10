/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

if (devicetype !== 'horizon')
    NotApplicable('This test only applies to a Horizon device');

module.exports = {
    'title'         : 'Horizon Netflix quit within Netflix test case',
    'description'   : 'Repeatedly goes into Netflix, do not play a movie and quits from within Netflix. Netflix should deactivate and from the App Store it should start when the user decides to go into Netflix again',
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
            'description'   : 'Press menu to go to main menu',
            'test'          : key,
            'params'        : menu
        },
        'init2' : {
            'sleep'         : 5,
            'description'   : 'Press 1 to force Cisco to go to the channel bar',
            'test'          : key,
            'params'        : one
        },
        'init3' : {
            'description'   : 'Stop Netflix',
            'test'          : stopPlugin,
            'params'        : 'Netflix',
            'validate'      : httpResponseSimple,
        },
        'init4' : {
            'sleep'         : 20,
            'description'   : 'Start Netflix',
            'test'          : startPlugin,
            'params'        : 'Netflix',
            'validate'      : httpResponseSimple,
        },
        'init5' : {
            'sleep'         : 15,
            'description'   : 'Check if Netflix is active',
            'test'          : getPluginState,
            'params'        : 'Netflix',
            'validate'      : checkResumedOrActivated
        },
        'step1' : {
            'sleep'         : 5,
            'description'   : 'Press menu',
            'test'          : key,
            'params'        : menu,
        },
        'step3' : {
            'sleep'         : 5,
            'description'   : 'Press left',
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
            'description'   : 'Press left',
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
            'description'   : 'Press ok to enter Netflix',
            'test'          : key,
            'params'        : ok,
        },
        'checkNFState' : {
            'sleep'         : 30,
            'description'   : 'Check if Netflix is active',
            'test'          : getPluginState,
            'params'        : 'Netflix',
            'validate'      : checkResumedOrActivated,
        },
        'checkWKState' : {
            'description'   : 'Check if WPEWebkit is hidden or suspended',
            'test'          : getPlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : (resp) => {
                var r = JSON.parse(resp.body);

                if (r.suspended === true || r.hidden === true)
                    return true
                else
                    throw new Error(`Expected WPEWebkit to be suspended or hidden, yet browser is ${r.suspended === 'true' ? 'suspended' : 'resumed'} and ${r.hidden === 'true' ? 'hidden' : 'visible'}`);

            }
        },
        'step8' : {
            'sleep'         : 5,
            'description'   : 'Press ok to login to first profile',
            'test'          : key,
            'params'        : ok,
        },
        'step9' : {
            'sleep'         : 5,
            'description'   : 'Press up to go to menu bar',
            'test'          : key,
            'params'        : up,
        },
        'step10' : {
            'sleep'         : 5,
            'description'   : 'Press left to go to exit option',
            'test'          : key,
            'params'        : left,
        },
        'step11' : {
            'sleep'         : 5,
            'description'   : 'Press left to go to settings option',
            'test'          : key,
            'params'        : left,
        },
        'step12' : {
            'sleep'         : 5,
            'description'   : 'Press ok to enter settings',
            'test'          : key,
            'params'        : ok,
        },
        'step13' : {
            'sleep'         : 5,
            'description'   : 'Press down to focus Change password',
            'test'          : key,
            'params'        : down,
        },
        'step14' : {
            'sleep'         : 5,
            'description'   : 'Press down to focus Get Help',
            'test'          : key,
            'params'        : down,
        },
        'step15' : {
            'sleep'         : 5,
            'description'   : 'Press down to focus Exit Netflix',
            'test'          : key,
            'params'        : down,
        },
        'step16' : {
            'sleep'         : 5,
            'description'   : 'Press ok to quit Netflix',
            'test'          : key,
            'params'        : ok,
        },
        'step17' : {
            'sleep'         : 5,
            'description'   : 'Check if Netflix is deactivated',
            'test'          : getPluginState,
            'params'        : 'Netflix',
            'assert'        : 'deactivated'
        },
        'step18' : {
            'sleep'         : 5,
            'description'   : 'Check if WPEWebKit is resumed and visible',
            'test'          : getPlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : (resp) => {
                var r = JSON.parse(resp.body);

                if (r.suspended === false && r.hidden === false)
                    return true
                else
                    throw new Error(`Expected WPEWebkit to be resumed and visible, yet browser is ${r.suspended === 'true' ? 'suspended' : 'resumed'} and ${r.hidden === 'true' ? 'hidden' : 'visible'}`);

            }
        },
        'step19' : {
            'description'   : 'Repeat',
            'goto'          : 'step7',
            'repeat'        : '30'
        }
    }
};
