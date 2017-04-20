/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'         : 'Netflix provisioning tests',
    'description'   : 'Validate if Netflix can start without provisioning',
    'steps'         : {
        'init0'  : {
            'description'   : 'Check if Netflix Plugin is present',
            'test'          : getPlugin,
            'params'        : 'Netflix',
            'validate'      : (resp) => {
                if (resp.status !== 400)
                    return true;

                NotApplicable('Build does not support Netflix');
            }
        },
        'init1'  : {
            'description'   : 'Check if Provisioning Plugin is present',
            'test'          : getPlugin,
            'params'        : 'Provisioning',
            'validate'      : (resp) => {
                if (resp.status !== 400)
                    return true;

                NotApplicable('Build does not support Provisioning');
            }
        },
        'init2' : {
            'description'   : 'Stop Provisioning & Netflix',
            'test'          : stopPlugins,
            'params'        : ['Netflix', 'Provisioning'],
            'validate'      : httpResponseSimple,
        },
        'step1' : {
            'sleep'         : 10,
            'description'   : 'Check if Provisioning is stopped succesfully',
            'test'          : getPluginState,
            'params'        : 'Provisioning',
            'assert'        : 'deactivated'
        },
        'step3' : {
            'description'   : 'Start Provisioning & Netflix',
            'test'          : startPlugin,
            'params'        : 'Netflix',
            'validate'      : httpResponseSimple,
        },
        'step4' : {
            'sleep'         : 30,
            'description'   : 'Check if Netflix is started succesfully',
            'test'          : getPluginState,
            'params'        : 'Netflix',
            'validate'      : checkResumedOrActivated,
        },
        'step5' : {
            'description'   : 'Check if Netflix is started without a valid ESN (screen stays blank)',
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
            'description'   : 'Cleanup, start provisioning module',
            'test'          : startPlugin,
            'params'        : 'Provisioning',
            'validate'      : httpResponseSimple
        }
    }
};
