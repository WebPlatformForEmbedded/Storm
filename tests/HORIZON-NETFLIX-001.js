/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

if (devicetype !== 'horizon')
    NotApplicable('This test only applies to a Horizon device');

var firstRun = true;

module.exports = {
    'title'             : 'Horizon Netflix suspend/resume test case',
    'description'       : 'Repeatedly goes into Netflix, plays a movie and during playback presses Main Menu. Netflix should suspend, Cisco should take over and no artifacts should be seen. Upon re-entering Netflix, Netflix should resume, no spinner show be shown and usr should land on the resume movie section',
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
            'sleep'         : 10,
            'description'   : 'Press ok',
            'test'          : key,
            'params'        : ok,
        },
        'step10' : {
            'sleep'         : 30,
            'description'   : 'Check if Netflix is active',
            'test'          : getPluginState,
            'params'        : 'Netflix',
            'validate'      : checkResumedOrActivated
        },
        'step11' : {
            'description'   : 'Repeat',
            'goto'          : 'step1',
            'repeat'        : '30'
        }
    }
};
