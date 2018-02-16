/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'             : 'Netflix provisioning tests',
    'description'       : 'Validate if the device is correctly provisioned for Netflix',
    'requiredPlugins'   : ['Netflix', 'Provisioning'],
    'steps'         : {
        'init2' : {
            'description'   : 'Stop Netflix',
            'test'          : stopPlugin,
            'params'        : 'Netflix',
            'validate'      : httpResponseSimple
        },
        'step1' : {
            'sleep'         : 10,
            'description'   : 'Request provisioning',
            'test'          : requestProvisioning,
        },
        'step2' : {
            'sleep'         : 10,
            'description'   : 'Check provisioning status',
            'test'          : getPlugin,
            'params'        : 'Provisioning',
            'validate'      : (resp) => {
                var prov = JSON.parse(resp.body);

                if (prov.id === undefined && prov.status === undefined)
                    throw new Error('Provisioning id or status is not present in response');

                if (parseInt(prov.status) > 0 && prov.tokens.length > 0)
                    if (prov.tokens.indexOf('netflix') !== -1)
                        return true; // device provisioned for Netflix
                    else
                        throw new Error('Device is not provisioned for Netflix');
                else
                    throw new Error('Device is not provisioned');

            }
        },
        'step3' : {
            'description'   : 'Start Netflix',
            'test'          : startPlugin,
            'params'        : 'Netflix',
            'validate'      : httpResponseSimple
        },
        'step4' : {
            'sleep'         : 30,
            'description'   : 'Check if Netflix has a valid ESN',
            'test'          : getPlugin,
            'params'        : 'Netflix',
            'validate'      : (resp) => {
                var data = JSON.parse(resp.body);

                if (resp.status > 400)
                    throw new Error('Netflix plugin is responding with an error');

                if (data.esn !== undefined && data.esn !== '' && data.esn.length > 0)
                    return true;
                else
                    throw new Error('Netflix does not have a ESN');
            }
        },
        'step5' : {
            'description'   : 'Cleanup, stop Netflix',
            'test'          : stopPlugin,
            'params'        : 'Netflix',
            'validate'      : httpResponseSimple
        }
    }
};
