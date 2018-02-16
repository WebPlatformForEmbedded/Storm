/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'             : 'WebServer shutdown of Framework robustness test',
    'description'       : 'Starts WebServer and stops Framework. Checks if everything is shutdown correctly',
    'requiredPlugins'   : ['WebServer'],
    'steps'             : {
        'step1' : {
            'description'   : 'Start WebServer',
            'timeout'       : 180,
            'test'          : startPlugin,
            'params'        : 'WebServer',
            'validate'      : httpResponseSimple
        },
        'step2' : {
            'sleep'         : 30,
            'description'   : 'Check if WebServer is started correctly',
            'timeout'       : 180, //seconds
            'test'          : getPluginState,
            'params'        : 'WebServer',
            'validate'      : checkResumedOrActivated,
        },
        'step3' : {
            'description'   : 'Stop Framework',
            'test'          : stopFramework,
            'assert'        : true,
        },
        'step4' : {
            'sleep'         : 5,
            'description'   : 'Check if WebServerImplementation rpcprocess is gone',
            'test'          : checkIfProcessIsRunning,
            'params'        : 'WebServerImplementation',
            'assert'        : false
        },
        'step5' : {
            'description'   : 'Start Framework',
            'test'          : startFramework,
            'assert'        : true
        },
        'step6' : {
            'description'   : 'Repeat',
            'goto'          : 'step1',
            'repeat'        : '30'
        }
    }
};
