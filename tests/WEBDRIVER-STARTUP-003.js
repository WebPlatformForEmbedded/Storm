/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'         : 'WebDriver shutdown of Framework robustness test',
    'description'   : 'Starts WebDriver and stops Framework. Checks if everything is shutdown correctly',
    'steps'         : {
        'init0'  : {
            'description'   : 'Check if WebDriver Plugin is present',
            'test'          : getPlugin,
            'params'        : 'WebDriver',
            'validate'      : (resp) => {
                if (resp.status !== 400)
                    return true;

                NotApplicable('Build does not support WebDriver');
            }
        },
        'init1' : {
            'description'   : 'Stop Netflix',
            'timeout'       : 180, //seconds
            'test'          : stopPlugin,
            'params'        : 'WebDriver',
        },
        'init2' : {
            'description'   : 'Stop WPEWebkit',
            'timeout'       : 180, //seconds
            'test'          : stopPlugin,
            'params'        : 'WebKitBrowser'
        },
        'init3' : {
            'description'   : 'Stop YouTube',
            'timeout'       : 180, //seconds
            'test'          : stopPlugin,
            'params'        : 'YouTube'
        },
        'step1' : {
            'description'   : 'Start WebDriver',
            'timeout'       : 180,
            'test'          : startPlugin,
            'params'        : 'WebDriver',
            'validate'      : httpResponseSimple
        },
        'step2' : {
            'sleep'         : 30,
            'description'   : 'Check if WebDriver is started correctly',
            'timeout'       : 180, //seconds
            'test'          : getPluginState,
            'params'        : 'WebDriver',
            'assert'        : 'activated'
        },
        'step3' : {
            'description'   : 'Stop Framework',
            'test'          : stopFramework,
            'assert'        : true
        },
        'step4' : {
            'sleep'         : 5,
            'description'   : 'Check if WebDriverImplementation rpcprocess is gone',
            'test'          : checkIfProcessIsRunning,
            'params'        : 'WebDriverImplementation',
            'assert'        : false
        },
        'step5' : {
            'sleep'         : 5,
            'description'   : 'Check if WPEProxy process is gone',
            'test'          : checkIfProcessIsRunning,
            'params'        : 'WPEProxy',
            'assert'        : false
        },
        'step6' : {
            'description'   : 'Start Framework',
            'test'          : startFramework,
            'assert'        : true
        }
    }
};
