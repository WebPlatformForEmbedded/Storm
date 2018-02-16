/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'             : 'OCDM shutdown of Framework robustness test',
    'description'       : 'Starts OCDM and stops Framework. Checks if everything is shutdown correctly',
    'requiredPlugins'   : ['OCDM'],
    'steps'             : {
        'step1' : {
            'description'   : 'Start OCDM',
            'timeout'       : 180,
            'test'          : startAndResumePlugin,
            'params'        : 'OCDM',
            'validate'      : httpResponseSimple
        },
        'step2' : {
            'sleep'         : 10,
            'description'   : 'Check if OCDM is started correctly',
            'timeout'       : 180, //seconds
            'test'          : getPluginState,
            'params'        : 'OCDM',
            'validate'      : checkResumedOrActivated
        },
        'step3' : {
            'description'   : 'Stop Framework',
            'test'          : stopFramework,
            'assert'        : true,
        },
        'step4' : {
            'sleep'         : 5,
            'description'   : 'Check if OCDMImplementation rpcprocess is gone',
            'test'          : checkIfProcessIsRunning,
            'params'        : 'OCDMImplementation',
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
