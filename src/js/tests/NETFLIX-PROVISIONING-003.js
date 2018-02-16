/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'             : 'Netflix provisioning tests',
    'description'       : 'Validate if Framework does not crash if you start Netflix without the provisioning module being active',
    'requiredPlugins'   : ['Netflix', 'Provisioning'],
    'steps'             : {
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
            'description'   : 'Start Netflix',
            'test'          : startPlugin,
            'params'        : 'Netflix',
            'validate'      : httpResponseSimple
        },
        'step4' : {
            'sleep'         : 30,
            'description'   : 'Check if Netflix is started succesfully',
            'test'          : getPluginState,
            'params'        : 'Netflix',
            'validate'      : checkResumedOrActivated,
        },
        'step5' : {
            'sleep'         : 30,
            'description'   : 'Check if Netflix is started without valid ESN (screen will stay blank)',
            'test'          : getPlugin,
            'params'        : 'Netflix',
            'validate'      : (resp) => {
                var data = JSON.parse(resp.body);

                if (resp.status > 400)
                    throw new Error('Netflix plugin is responding with an error');

                if (data.esn !== undefined && data.esn === '' && data.esn.length === 0)
                    return true;
                else
                    throw new Error('Expected Netflix to not have an ESN, yet it does');
            }
        },
        'step6' : {
            'description'   : 'Cleanup, stop Netflix',
            'test'          : stopPlugin,
            'params'        : 'Netflix',
            'validate'      : httpResponseSimple
        },
        'step7' : {
            'description'   : 'Cleanup, start Provisioning',
            'test'          : startPlugin,
            'params'        : 'Provisioning',
            'validate'      : httpResponseSimple
        }
    }
};
