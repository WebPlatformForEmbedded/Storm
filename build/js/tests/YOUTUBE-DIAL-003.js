/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'             : 'Framework DIAL YouTube robustness test',
    'description'       : 'Repeatedly starts and stops YouTube through DIAL',
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
            'description'   : 'Get the YouTube DIAL app xml',
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
        'startYouTube' : {
            'description'   : 'Start YouTube using DIAL',
            'timeout'       : 20, //seconds
            'test'          : dialStart,
            'params'        : 'YouTube',
        },
        'checkYouTube1' : {
            'description'   : 'Check YouTube status on DIAL',
            'sleep'         : 30,
            'timeout'       : 60, //seconds
            'test'          : dialState,
            'params'        : 'YouTube',
            'assert'        : 'running'
        },        
        'stopYouTube' : {
            'description'   : 'Stop YouTube using DIAL',
            'timeout'       : 20, //seconds
            'test'          : dialStop,
            'params'        : 'YouTube',
        },
        'checkYouTube2' : {
            'description'   : 'Check YouTube status on DIAL',
            'sleep'         : 30,
            'timeout'       : 60, //seconds
            'test'          : dialState,
            'params'        : 'YouTube',
            'assert'        : 'stopped'
        },
        'checkFramework' : {
            'description'   : 'Check YouTube status on Framework',
            'timeout'       : 60, //seconds
            'test'          : getPluginState,
            'params'        : 'YouTube',
            'validate'      : 'deactivated'
        },
        'repeat' : {
            'description'   : 'Repeat the start/stop procedure of YouTube',
            'goto'          : 'startYouTube',
            'repeat'        : 40
        }
    }
};
