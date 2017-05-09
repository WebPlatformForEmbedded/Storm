/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'             : 'OpenCDMi shutdown of Framework robustness test',
    'description'       : 'Starts OpenCDMi and stops Framework. Checks if everything is shutdown correctly',
    'requiredPlugins'   : ['OpenCDMi'],
    'steps'             : {
        'step1' : {
            'description'   : 'Start OpenCDMi',
            'timeout'       : 180,
            'test'          : startAndResumePlugin,
            'params'        : 'OpenCDMi',
            'validate'      : httpResponseSimple
        },
        'step2' : {
            'sleep'         : 10,
            'description'   : 'Check if OpenCDMi is started correctly',
            'timeout'       : 180, //seconds
            'test'          : getPluginState,
            'params'        : 'OpenCDMi',
            'validate'      : checkResumedOrActivated
        },
        'step3' : {
            'description'   : 'Stop Framework',
            'test'          : stopFramework,
            'assert'        : true,
        },
        'step4' : {
            'sleep'         : 5,
            'description'   : 'Check if OpenCDMiImplementation rpcprocess is gone',
            'test'          : checkIfProcessIsRunning,
            'params'        : 'OpenCDMiImplementation',
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
    },
    'cleanup'       : restartFramework
};
