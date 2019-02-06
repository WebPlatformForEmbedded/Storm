/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'             : 'Netflix provisioning tests',
    'description'       : 'Validate if Framework does not crash if you start Netflix without the provisioning module being active',
    'requiredPlugins'   : ['Netflix', 'Provisioning'],
    'steps'         : {
        'step1' : {
            'description'   : 'Stop Provisioning & Netflix',
            'test'          : stopPlugins,
            'params'        : ['Netflix', 'Provisioning'],
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
                    if (prov.tokens.indexOf('netflix') !== -1)
                        return true; // device provisioned for Netflix
                    else
                        throw new Error('Device is not provisioned for Netflix');
                else
                    throw new Error('Device is not provisioned');

            }
        },        
        'step8' : {
            'description'   : 'Start Netflix',
            'test'          : startPlugin,
            'params'        : 'Netflix',
            'validate'      : httpResponseSimple
        },
        'step9' : {
            'sleep'         : 30,
            'description'   : 'Check if Netflix is started succesfully',
            'test'          : getPluginState,
            'params'        : 'Netflix',
            'validate'      : checkResumedOrActivated,
        },
        'step10' : {
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
        'step11' : {
            'description'   : 'Repeat steps 30 times',
            'goto'          : 'step1',
            'repeat'        : 30
        },
        'step12' : {
            'description'   : 'Cleanup, stop Netflix',
            'test'          : stopPlugin,
            'params'        : 'Netflix',
            'validate'      : httpResponseSimple
        }
    }
};
