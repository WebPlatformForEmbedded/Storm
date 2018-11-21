/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'             : 'WPEWebkit Peacekeeper Benchmark test',
    'description'       : 'Loads the Peacekeeper Benchmark test and get the results',
    'requiredPlugins'   : ['WebKitBrowser'],
    'steps'             : {
        'init1' : {
            'description'   : 'Disable monitor',
            'test'          : stopPlugin,
            'params'        : 'Monitor',
            'validate'      : httpResponseSimple
        },
        'step1' : {
            'description'   : 'Stop WPEWebkit',
            'timeout'       : 180, //seconds
            'test'          : stopPlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple,
        },
        'step2' : {
            'sleep'         : 20,
            'description'   : 'Check if WPEWebkit is succesfully stopped',
            'timeout'       : 30, //seconds
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'assert'        : 'deactivated',
        },
        'step3' : {
            'description'   : 'Start WPEWebkit',
            'timeout'       : 180, //seconds
            'test'          : startAndResumePlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple,
        },
        'step4' : {
            'sleep'         : 20,
            'description'   : 'Check if WPEWebkit is started',
            'timeout'       : 180, //seconds
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'validate'      : checkResumedOrActivated,
        },
        'step5' : {
            'description'   : 'Load http://peacekeeper.futuremark.com/run.action',
            'timeout'       : 180, //seconds
            'test'          : setUrl,
            'params'        : 'http://peacekeeper.futuremark.com/run.action',
            'validate'      : httpResponseSimple,
        },
        'step6' : {
            'sleep'         : 15,
            'description'   : 'Check if URL is loaded',
            'timeout'       : 180, //seconds
            'test'          : getUrl,
            'assert'        : 'http://peacekeeper.futuremark.com/run.action',
        },
        'step7' : {
            'sleep'         : 8 * 60, //8 mins
            'description'   : 'Validate the test by verifying if the url is still loaded',
            'timeout'       : 10 * 60, //seconds
            'test'          : getUrl,
            'validate'      : (resp) => {
                var PeacekeeperUrl = resp.split('?');
                var result = PeacekeeperUrl[0];
                if (result == 'http://peacekeeper.futuremark.com/results')
                    return true
                else
                    throw new Error(`Expected ${result} while result was ${resp}`);
            }
        },
        'cleanup1' : {
            'description'   : 'Clean up the test',
            'timeout'       : 60,
            'test'          : setUrl,
            'params'        : 'about:blank',
            'validate'      : httpResponseSimple
        },
        'cleanup2' : {
            'description'   : 'Enable monitor',
            'test'          : startPlugin,
            'params'        : 'Monitor',
            'validate'      : httpResponseSimple
        }
    }
};
