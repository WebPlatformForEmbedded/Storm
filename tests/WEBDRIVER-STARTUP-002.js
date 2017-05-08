/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'             : 'WebDriver StartUp',
    'description'       : 'Load the WebDriver plugin and check the status',
    'requiredPlugins'   : ['WebDriver'],
    'steps'             : {
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
        'init1'  : {
            'description'   : 'Make sure WPEWebkit is stopped',
            'test'          : stopPlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple,
        },
        'step1' : {
            'description'   : 'Stop WebDriver',
            'test'          : stopPlugin,
            'params'        : 'WebDriver',
            'validate'      : httpResponseSimple,
        },
        'step2' : {
            'sleep'         : 20,
            'description'   : 'Check if WebDriver is succesfully stopped',
            'test'          : getPluginState,
            'params'        : 'WebDriver',
            'assert'        : 'deactivated'
        },
        'step3' : {
            'description'   : 'Start WebDriver',
            'test'          : startPlugin,
            'params'        : 'WebDriver',
            'validate'      : httpResponseSimple
        },
        'step4' : {
            'sleep'         : 20,
            'description'   : 'Check if WebDriver is started',
            'test'          : getPluginState,
            'params'        : 'WebDriver',
            'assert'        : 'activated'
        },
        'repeat' : {
            'description'   : 'Repeat starting/stopping of WebDriver 30 times',
            'goto'          : 'step1',
            'repeat'        : 30
        }
    },
    'cleanup'   : (cb) => {
        stopPlugin('WebDriver', (resp) => {
            cb(resp);
        });
    }
};
