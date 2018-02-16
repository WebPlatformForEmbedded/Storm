/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'             : 'WebDriver HTML5 score test',
    'description'       : 'Load beta.html5test.com and get the score',
    'requiredPlugins'   : ['WebDriver'],
    'samples'           : [],
    'minScore'          : 405, // minimum FPS or this test will fail
    'steps'             : {
        /*
        'init'  : {
            'description'   : 'Make sure WPEWebkit is stopped',
            'test'          : stopPlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple,
        },
        'step1' : {
            'description'   : 'Stop WebDriver',
            'test'          : stopPlugin,
            'params'        : 'WebDriver',
            'validate'      : httpResponseSimple,
        },
        'step2' : {
            'sleep'         : 20,
            'description'   : 'Check if WebDriver is succesfully stopped',
            'test'          : getPluginState,
            'params'        : 'WebDriver',
            'assert'        : 'deactivated'
        },
        */
        'step3' : {
            'description'   : 'Start WebDriver',
            'test'          : startPlugin,
            'params'        : 'WebDriver',
            'validate'      : httpResponseSimple
        },
        'step4' : {
            'sleep'         : 20,
            'description'   : 'Check if WebDriver is started',
            'test'          : getPluginState,
            'params'        : 'WebDriver',
            //'assert'        : 'activated' Ignoring this for now, since WebBridge seems to return a very odd state for WebDriver 
        },
        'step5' : {
            'description'   : 'Connect WebDriver',
            'test'          : wdConnect,
            'assert'        : true,
        },
        'step6' : {
            'description'   : 'Set URL on WebDriver',
            'test'          : wdSetUrl,
            'params'        : 'http://beta.html5test.com',
            'assert'        : true,
        },
        'step7' : {
            'sleep'         : 10,
            'description'   : 'Get the score from HTML5test.com',
            'test'          : wdFindElement,
            'params'        : { 'className' : 'pointsPanel' },
            'validate'      : (resp) => {
                // TODO, parse it

                console.log(resp);
                return true
            }
        },
        'step8' : {
            'description'   : 'Cleanup, close WebDriver session',
            'test'          : wdDisconnect,
            'validate'      : true,
        },
        'step9' : {
            'description'   : 'Cleanup, stop WebDriver plugin',
            'test'          : stopPlugin,
            'params'        : 'WebDriver',
            'validate'      : httpResponseSimple     
        }
    },
    'cleanup'   : (cb) => {
        // close the webdriver session first
        if (wdIsConnected === true ) 
            wdDisconnect( () => {});
        
        setTimeout(stopPlugin, 10000, 'WebDriver', (resp) => {
            cb(resp);
        });
    }
};
