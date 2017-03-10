/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'         : 'Framework provision tests',
    'description'   : 'Check if device is provisioned',
    'steps'         : {
        'init0'  : {
            'description'   : 'Check if Provisioning Plugin is present',
            'test'          : getPlugin,
            'params'        : 'Provisioning',
            'validate'      : (resp) => {
                if (resp.status !== 400)
                    return true;

                NotApplicable('Build does not support Provisioning');
            }
        },
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
            'description'   : 'Check provisioning status',
            'test'          : getPlugin,
            'params'        : 'Provisioning',
            'validate'      : (resp) => {
                var prov = JSON.parse(resp.body);

                if (prov.id === undefined && prov.status === undefined)
                    throw new Error('Provisioning id or status is not present in response');

                if (parseInt(prov.status) === 0)
                    return true; // device not provisioned
                else if (parseInt(prov.status) > 0 && prov.tokens.length > 0)
                    return true; // device provisioned
                else
                    throw new Error('Provisioning tokens and status do not match');

            }
        },
        'step6' : {
            'description'   : 'Request provisioning',
            'test'          : requestProvisioning,
            'validate'      : httpResponseSimple,
        },
        'step7' : {
            'sleep'         : 10,
            'description'   : 'Check provisioning status',
            'test'          : getPlugin,
            'params'        : 'Provisioning',
            'validate'      : (resp) => {
                var prov = JSON.parse(resp.body);

                if (prov.id === undefined && prov.status === undefined)
                    throw new Error('Provisioning id or status is not present in response');

                if (parseInt(prov.status) > 0 && prov.tokens.length > 0)
                    return true; // device provisioned
                else
                    throw new Error('Device is not provisioned');

            }
        },
    },
    'cleanup'       : restartFramework
};
