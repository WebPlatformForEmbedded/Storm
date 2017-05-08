/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'             : 'Framework provision tests',
    'description'       : 'Tests if the Framework provision module works',
    'requiredPlugins'   : ['Provisioning'],
    'steps'         : {
        'step1' : {
            'description'   : 'Stop Provisioning module',
            'test'          : stopPlugin,
            'params'        : 'Provisioning',
            'validate'      : httpResponseSimple,
        },
        'step2' : {
            'sleep'         : 10,
            'description'   : 'Check if Provisioning is stopped succesfully',
            'test'          : getPluginState,
            'params'        : 'Provisioning',
            'assert'        : 'deactivated'
        },
        'step3' : {
            'description'   : 'Start Provisioning module',
            'test'          : startPlugin,
            'params'        : 'Provisioning',
            'validate'      : httpResponseSimple,
        },
        'step4' : {
            'sleep'         : 10,
            'description'   : 'Check if Provisioning is started succesfully',
            'test'          : getPluginState,
            'params'        : 'Provisioning',
            'assert'        : 'activated'
        },
        'step5' : {
            'description'   : 'Get Plugin Data',
            'test'          : getPlugin,
            'params'        : 'Provisioning',
            'validate'      : (resp) => {
                var prov = JSON.parse(resp.body);

                if (prov.id === undefined)
                    throw new Error('Provisioning id is not present');

                if (prov.status === undefined || isNaN(parseInt(prov.status)) === true)
                    throw new Error('Provisioning status is not provided');

                return true;
            }
        }
    },
    'cleanup'       : restartFramework
};
