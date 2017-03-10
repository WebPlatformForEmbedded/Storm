/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'         : 'Framework DIAL Netflix robustness test',
    'description'   : 'Repeatedly starts and stops Netflix through DIAL',
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
        'init1'  : {
            'description'   : 'Check if DIALServer Plugin is present',
            'test'          : getPlugin,
            'params'        : 'DIALServer',
            'validate'      : (resp) => {
                if (resp.status !== 400)
                    return true;

                NotApplicable('Build does not support DIALServer');
            }
        },
        'init1' : {
            'description'   : 'Start WPEWebkit & DIALServer',
            'timeout'       : 180, //seconds
            'test'          : startPlugins,
            'params'        : ['WebKitBrowser', 'DIALServer'],
            'validate'      : httpResponseSimple,
        },
        'setAppStore' : {
            'sleep'         : 10,
            'description'   : 'Set the App Store URL',
            'test'          : setUrl,
            'params'        : 'http://widgets.metrological.com/liberty/nl/rpi-reference',
        },
        'step1' : {
            'description'   : 'Check if plugin is started',
            'sleep'         : 10,
            'timeout'       : 20, //seconds
            'test'          : getPluginState,
            'params'        : 'DIALServer',
            'assert'        : 'activated'
        },
        'step2' : {
            'sleep'         : 5,
            'description'   : 'Get the Netflix DIAL app xml',
            'timeout'       : 30, //seconds
            'test'          : dialGetApp,
            'params'        : 'Netflix',
            'validate'      : function(response) {
                if (response.error !== undefined)
                    return false;
                else
                    return true
            },
        },
        'step3' : {
            'description'   : 'Start Netflix using DIAL',
            'timeout'       : 20, //seconds
            'test'          : dialStart,
            'params'        : 'Netflix',
        },
        'step4' : {
            'description'   : 'Check Netflix status on DIAL',
            'sleep'         : 30,
            'timeout'       : 60, //seconds
            'test'          : dialState,
            'params'        : 'Netflix',
            'assert'        : 'running'
        },
        'step5' : {
            'description'   : 'Check Netflix status on Framework',
            'timeout'       : 60, //seconds
            'test'          : getPluginState,
            'params'        : 'Netflix',
            'validate'      : checkResumedOrActivated,
        },
        'step6' : {
            'description'   : 'Stop Netflix using DIAL',
            'timeout'       : 20, //seconds
            'test'          : dialStop,
            'params'        : 'Netflix',
        },
        'step7' : {
            'description'   : 'Check Netflix status on DIAL',
            'sleep'         : 30,
            'timeout'       : 60, //seconds
            'test'          : dialState,
            'params'        : 'Netflix',
            'assert'        : 'stopped'
        },
        'step8' : {
            'description'   : 'Check Netflix status on Framework',
            'timeout'       : 60, //seconds
            'test'          : getPluginState,
            'params'        : 'Netflix',
            'validate'      : 'deactivated'
        },
        'step9' : {
            'description'   : 'Repeat the start/stop procedure of Netflix',
            'goto'          : 'step3',
            'repeat'        : 30
        }
    }
};
