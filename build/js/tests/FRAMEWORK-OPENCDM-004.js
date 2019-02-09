/**
 * WPETestFramework test
 */
 /*jslint esnext: true*/

NotApplicable('This test needs to be updated');

test = {
    'disabled'          : 'true',
    'title'             : 'OCDM playback test',
    'description'       : 'Start a playready video while OCDM plugin is disabled',
    'requiredPlugins'   : ['OCDM', 'WebKitBrowser', 'Snapshot'],
    'port'              : undefined,
    'server'            : undefined,
    'maxSameScreenshot' : 3, // amount of times its okay to have the same screenshot
    'curSameScreenshot' : 0, // counter
    'prevScreenshot'    : undefined,
    'steps'             : {
        'init1' : {
            'sleep'         : 10,
            'description'   : 'Load resources to start the test',
            'test'          : function(x, callback) {
                readApp((err, app) => {
                    if (err || app === undefined) 
                        callback(false);

                    test.app = '' + app;
                    callback(true);
                });
            },
        },
        'init2' : {
            'description'   : 'Start the HTTP server, serve the app',
            'timeout'       : 180, //seconds
            'test'          : startHttpServer,
            'params'        : function (request, response) {

                var parsedUrl = url.parse(request.url, false);

                //console.log('New request with url: ' + parsedUrl.pathname);

                function returnApp(){
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.end(test.app);
                }

                var responseLookup = {
                    '/app'       : returnApp,
                };

                var fn = responseLookup[ parsedUrl.pathname ];

                if (fn !== undefined) {
                    fn(parsedUrl.pathname);
                } else {
                    response.writeHead(404, {'Content-Type': 'text/html'});
                    response.end('Not found');
                }
            },
            'validate'      : (port) => {
                if (port === null || port === undefined)
                    return false;

                test.port = port;
                return true;
            }
        },
        'init3' : {
            'description'   : 'Determine IP to use',
            'test'          : matchIpRange,
            'params'        : host,
            'validate'      : (response) => {
                if (response === undefined)
                    return false;

                test.server = response;

                // update the app to reflect what we are going to use the serve the app from
                test.app = test.app.replace(/{{server}}/g, test.server);
                test.app = test.app.replace(/{{port}}/g, test.port);

                return true;
            }
        },
        'step1' : {
            'description'   : 'Stop WPEWebkit',
            'test'          : stopPlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple,
        },
        'step2' : {
            'sleep'         : 5,
            'description'   : 'Check if WPEWebkit is stopped correctly',
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'assert'        : 'deactivated'
        },
        'step3' : {
            'description'   : 'stop OCDM plugin',
            'timeout'       : 180, //seconds
            'test'          : stopPlugin,
            'params'        : 'OCDM',
            'validate'      : httpResponseSimple,
        },
        'step4' : {
            'sleep'         : 5,
            'description'   : 'Check if OCDM is stopped succesfully',
            'test'          : getPluginState,
            'params'        : 'OCDM',
            'assert'        : 'deactivated',
        },
        'step5' : {
            'description'   : 'Start the WebKit Plugin',
            'test'          : startAndResumePlugin,
            'params'        : 'WebKitBrowser',
        },
        'step6' : {
            'sleep'         : 5,
            'description'   : 'Check if the WebKit Plugin is started',
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'validate'      : checkResumedOrActivated,
        },
        'step7' : {
            'description'   : 'Load the app on WebKit',
            'test'          : function (x, cb) {
                var _url = `http://${test.server}:${test.port}/app`;
                setUrl(_url, cb);
            },
            'validate'      : httpResponseSimple,
        },
        'step8' : {
            'sleep'         : 5,
            'description'   : 'Check if app is loaded on WebKit',
            'test'          : getUrl,
            'validate'      : (resp) => {
                if (resp === `http://${test.server}:${test.port}/app`)
                    return true;
                
                throw new Error('URL did not load on WebKit');
            }
        },
        'step9' : {
            'sleep'         : 5,
            'description'   : 'Check if screen updates',
            'test'          : screenshot,
            'validate'      : (res) => {
                if ( test.prevSceenshot === undefined || test.prevSceenshot !== undefined && test.prevSceenshot.equals(res) === true) {
                    test.prevSceenshot = res;
                    test.curSameScreenshot++;
                    return true;
                } else {
                    throw new Error('Screen updated');
                }

                if (test.curSameScreenshot >= test.maxSameScreenshot) {
                    console.log('Screen did not update, new screenshot is the same as previous screenshot for ' + test.curSameScreenshot + ' times.');
                    return true;
                }
            }
        },
        'step10' : {
            'description'   : 'Repeat step9 till the video ends',
            'goto'          : 'step9',
            'repeat'        : 5,
        }
    },
    'cleanup'       : restartFramework,
};

function readApp(callback){
    fs.readFile('./tests/resources/eme_v1_2_3.html', function(err, data){
        if (err){
            throw err;
        } else {
            callback(undefined, data);
        }
    });
}
