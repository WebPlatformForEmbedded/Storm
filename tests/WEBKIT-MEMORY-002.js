/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

const MAX_MEMORY = 85 * 1000 * 1000; // b

module.exports = {
    'title'             : 'WPEWebkit Memory test',
    'description'       : 'Loads youtube and checks the memory usage',
    'requiredPlugins'   : ['WebKitBrowser', 'Monitor'],
    'steps'         : {
        'step1' : {
            'description'   : 'Stop WPEWebkit',
            'test'          : stopPlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple,
        },
        'step2' : {
            'sleep'         : 15,
            'description'   : 'Start WPEWebkit',
            'test'          : startAndResumePlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple
        },
        'step3' : {
            'sleep'         : 15,
            'description'   : 'Check if WPEWebkit is started correctly',
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'validate'      : checkResumedOrActivated,
        },
        'step4' : {
            'description'   : 'Load URL about:blank',
            'test'          : setUrl,
            'params'        : 'https://www.youtube.com/tv'
        },
        'step5' : {
            'sleep'         : 1,
            'description'   : 'Check WPE WebKit memory usage through Monitor',
            'test'          : getMemoryUsageForPlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : (response) => {
                if (response !== undefined && response.measurment !== undefined && response.measurment.resident !== undefined &&  response.measurment.resident.last !== undefined) {
                    if ( response.measurment.resident.last < MAX_MEMORY)
                        return true;
                    else
                        throw Error(`WebKitBrowser memory usage ${response.measurment.resident.last} is higher then ${MAX_MEMORY} while loading about:blank`);
                } else {
                    throw Error('Resident memory measurement not found in monitor response');
                }
            }
        }
    }
};
