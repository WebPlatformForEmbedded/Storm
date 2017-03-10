/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'         : 'Framework DIAL Netflix test',
    'description'   : 'Tests the DIAL server for the Netflix application',
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
        'init2' : {
            'description'   : 'Start WPEWebkit & DIALServer',
            'timeout'       : 180, //seconds
            'test'          : startPlugins,
            'params'        : ['WebKitBrowser', 'DIALServer'],
            'validate'      : httpResponseSimple,
        },
        'init3' : {
            'sleep'         : 10,
            'description'   : 'Set the App Store URL',
            'test'          : setUrl,
            'params'        : 'http://widgets.metrological.com/liberty/nl/rpi-reference',
        },
        'step1' : {
            'description'   : 'Check if plugin is started',
            'sleep'         : 15,
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
            'description'   : 'Stop Netflix using DIAL',
            'timeout'       : 20, //seconds
            'test'          : dialStop,
            'params'        : 'Netflix',
        },
        'step6' : {
            'description'   : 'Check Netflix status on DIAL',
            'sleep'         : 10,
            'timeout'       : 60, //seconds
            'test'          : dialState,
            'params'        : 'Netflix',
            'assert'        : 'stopped'
        },
        'step7' : {
            'description'   : 'Check Netflix status on Framework',
            'timeout'       : 60, //seconds
            'test'          : getPluginState,
            'params'        : 'Netflix',
            'validate'      : 'deactivated'
        },
        'step7' : {
            'description'   : 'Stop Netflix using DIAL while stopped - should be 404',
            'timeout'       : 20, //seconds
            'test'          : dialStop,
            'params'        : 'Netflix',
            'validate'      : (response) => {
                if (response.status === 404)
                    return true;
                else
                    return false;
            }
        },
        'step8' : {
            'description'   : 'Start incorrect netflix (casing) - should Be 404',
            'timeout'       : 60, //seconds
            'test'          : dialStart,
            'params'        : 'netflix',
            'validate'      : (response) => {
                if (response.status === 404)
                    return true;
                else
                    return false;
            }
        },
        'step9' : {
            'description'   : 'Start incorrect netflix (casing) - should Be 404',
            'timeout'       : 60, //seconds
            'test'          : dialStop,
            'params'        : 'netflix',
            'validate'      : (response) => {
                if (response.status === 404)
                    return true;
                else
                    return false;
            }
        },
        'step10' : {
            'description'   : 'Start incorrect netflix1 (non-existent) - should Be 404',
            'timeout'       : 60, //seconds
            'test'          : dialStop,
            'params'        : 'netflix',
            'validate'      : (response) => {
                if (response.status === 404)
                    return true;
                else
                    return false;
            }
        },
    }
};
