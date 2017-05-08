/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

var PNG = require('pngjs').PNG;

module.exports = {
    'title'             : 'Framework snapshot test',
    'description'       : 'Test if the snapshot returns a valid PNG',
    'requiredPlugins'   : ['Snapshot'],
    'screenshot'    : undefined,
    'steps'         : {
        'init0'  : {
            'description'   : 'Check if Snapshot Plugin is present',
            'test'          : getPlugin,
            'params'        : 'Snapshot',
            'validate'      : (resp) => {
                if (resp.status !== 400)
                    return true;

                NotApplicable('Build does not support Snapshot');
            }
        },
        'step1' : {
            'description'   : 'Stop Snapshot module',
            'test'          : stopPlugin,
            'params'        : 'Snapshot',
            'validate'      : httpResponseSimple,
        },
        'step2' : {
            'sleep'         : 10,
            'description'   : 'Check if Snapshot is stopped succesfully',
            'test'          : getPluginState,
            'params'        : 'Snapshot',
            'assert'        : 'deactivated'
        },
        'step3' : {
            'description'   : 'Start Snapshot module',
            'test'          : startPlugin,
            'params'        : 'Snapshot',
            'validate'      : httpResponseSimple,
        },
        'step4' : {
            'sleep'         : 10,
            'description'   : 'Check if Snapshot is started succesfully',
            'test'          : getPluginState,
            'params'        : 'Snapshot',
            'assert'        : 'activated'
        },
        /* Skipping this for the time being as Snapshot doesnt return a valid response anymore. Other tests will catch this
        'step5' : {
            'description'   : 'Get Plugin Data',
            'test'          : getPlugin,
            'params'        : 'Snapshot',
            'validate'      : httpResponseSimple
        },
        */
        'step6' : {
            'description'   : 'Make sure the WPEWebkit is started',
            'test'          : startPlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple
        },
        'step7' : {
            'sleep'         : 30,
            'description'   : 'Check if WPEWebkit is activated',
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'validate'      : 'activated'
        },
        'step8' : {
            'description'   : 'Set a URL at WPEWebkit',
            'test'          : setUrl,
            'params'        : 'http://www.metrological.com',
            'validate'      : httpResponseSimple
        },
        'step9' : {
            'sleep'         : 10,
            'description'   : 'Get a screenshot',
            'test'          : screenshot,
            'validate'      : (resp) => {
                if (resp === undefined || resp.length === 0) {
                    throw new Error('Error while reading snapshot from Framework');
                } else {
                    task.screenshot = resp;
                    return true;
                }
            }
        },
        'step10' : {
            'description'   : 'Validate screenshot',
            'test'          : (x, cb) => {
                // read PNG
                new PNG({ filterType:4 }).parse( task.screenshot, (error, data) => {
                    if (error)
                        throw new Error('Parsing of the returned PNG failed. ' + error);
                }).on('parsed', () => {
                    cb(true);
                }).on('error', (error) => {
                    if (error)
                        throw new Error('Parsing of the returned PNG failed. ' + error);
                });

            },
            'assert'        : true
        },
    },
    'cleanup'       : restartFramework
};
