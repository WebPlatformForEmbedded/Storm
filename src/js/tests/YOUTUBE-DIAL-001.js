/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

NotApplicable('This test needs to be updated');

test = {
    'disabled'          : 'true',
    'title'             : 'Framework DIAL YouTube test',
    'description'       : 'Tests the DIAL server for the YouTube application',
    'requiredPlugins'   : ['YouTube', 'DIALServer'],
    'steps'             : {
        'step1' : {
            'sleep'         : 15,
            'description'   : 'Start the DIAL server plugin',
            'timeout'       : 180, //seconds
            'test'          : startPlugin,
            'params'        : 'DIALServer',
            'validate'      : httpResponseSimple
        },
        'step2' : {
            'description'   : 'Check if plugin is started',
            'sleep'         : 10,
            'timeout'       : 20, //seconds
            'test'          : getPluginState,
            'params'        : 'DIALServer',
            'assert'        : 'activated'
        },
        'step3' : {
            'sleep'         : 5,
            'description'   : 'Get the Netflix DIAL app xml',
            'timeout'       : 30, //seconds
            'test'          : dialGetApp,
            'params'        : 'YouTube',
            'validate'      : function(response) {
                if (response.error !== undefined)
                    return false;
                else
                    return true
            },
        },
        'startNetflix' : {
            'description'   : 'Start YouTube using DIAL',
            'timeout'       : 20, //seconds
            'test'          : dialStart,
            'params'        : 'YouTube',
        },
        'checkNetflix1' : {
            'description'   : 'Check YouTube status on DIAL',
            'sleep'         : 30,
            'timeout'       : 60, //seconds
            'test'          : dialState,
            'params'        : 'YouTube',
            'assert'        : 'running'
        },        
        'stopNetflix' : {
            'description'   : 'Stop YouTube using DIAL',
            'timeout'       : 20, //seconds
            'test'          : dialStop,
            'params'        : 'YouTube',
        },
        'checkNetflix2' : {
            'description'   : 'Check YouTube status on DIAL',
            'sleep'         : 10,
            'timeout'       : 60, //seconds
            'test'          : dialState,
            'params'        : 'YouTube',
            'assert'        : 'stopped'
        },
        'checkFramework' : {
            'description'   : 'Check YouTube status on Framework',
            'timeout'       : 60, //seconds
            'test'          : getPluginState,
            'params'        : 'Netflix',
            'validate'      : 'deactivated'
        },
        'stopNetFlixAgain' : {
            'description'   : 'Stop YouTube using DIAL while stopped - should be 404',
            'timeout'       : 20, //seconds
            'test'          : dialStop,
            'params'        : 'YouTube',
            'validate'      : (response) => {
                if (response.status === 404)
                    return true;
                else
                    return false;
            }
        },
        'startInvalidNetflix' : {
            'description'   : 'Start incorrect youtube (casing) - should Be 404',
            'timeout'       : 60, //seconds
            'test'          : dialStart,
            'params'        : 'youtube',
            'validate'      : (response) => {
                if (response.status === 404)
                    return true;
                else
                    return false;
            }
        },
        'stopInvalidNetflix' : {
            'description'   : 'Start incorrect youtube (casing) - should Be 404',
            'timeout'       : 60, //seconds
            'test'          : dialStop,
            'params'        : 'youtube',
            'validate'      : (response) => {
                if (response.status === 404)
                    return true;
                else
                    return false;
            }
        },
        'startInvalidNetflix1' : {
            'description'   : 'Start incorrect youtube1 (non-existent) - should Be 404',
            'timeout'       : 60, //seconds
            'test'          : dialStop,
            'params'        : 'youtube',
            'validate'      : (response) => {
                if (response.status === 404)
                    return true;
                else
                    return false;
            }
        },
    }
};
