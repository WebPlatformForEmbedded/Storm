/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

if (devicetype !== 'horizon')
    NotApplicable('This test only applies to a Horizon device');

var firstRun = true;

module.exports = {
    'title'             : 'Horizon Netflix exit within Netflix test case',
    'description'       : 'Repeatedly goes into Netflix, do not play a movie and exits from within Netflix. Netflix should suspend and from the App Store it should resume when the user decides to go into Netflix again',
    'requiredPlugins'   : ['Netflix'],
    'steps'         : {
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
            'description'   : 'Press ok to login to first profile (only on first time)',
            'test'          : (cb) => {
                if (firstRun === true){
                    key(ok, cb);
                    firstRun = false;
                } else {
                    cb();
                }
            },
        },
        'step9' : {
            'sleep'         : 5,
            'description'   : 'Back to go to the menu bar',
            'test'          : key,
            'params'        : back,
        },
        'step10' : {
            'sleep'         : 5,
            'description'   : 'Press left to go to exit option',
            'test'          : key,
            'params'        : left,
        },
        'step16' : {
            'sleep'         : 5,
            'description'   : 'Press ok to suspend Netflix',
            'test'          : key,
            'params'        : ok,
        },
        'step17' : {
            'sleep'         : 5,
            'description'   : 'Check if Netflix is suspended',
            'test'          : getPlugin,
            'params'        : 'Netflix',
            'validate'      : (resp) => {
                var r = JSON.parse(resp.body);

                if (r.suspended === true)
                    return true
                else
                    throw new Error(`Expected Netflix to be suspended, yet its ${r.suspended === 'true' ? 'suspended' : 'resumed'}`);

            }
        },
        'step18' : {
            'sleep'         : 5,
            'description'   : 'Check if WPEWebkit is resumed and visible',
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
