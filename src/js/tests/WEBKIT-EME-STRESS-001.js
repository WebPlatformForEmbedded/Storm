/**
 * Metromatic test
 */
/*jslint esnext: true*/

NotApplicable('This test needs to be updated');

const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
require('shelljs/global');

test = {
    'disabled'          : 'true',
    'title'             : 'Stress test using eme.html test',
    'description'       : 'Loads eme.html test page and runs stress tests by playing a video for 3 hours',
    'requiredPlugins'   : ['WebKitBrowser', 'Snapshot'],
    'port'              : undefined,
    'server'            : undefined,
    'maxSameScreenshot' : 5, // amount of times its okay to have the same screenshot
    'curSameScreenshot' : 0, // counter
    'prevScreenshot'    : undefined,
    'steps'             : {
        'init0' : {
            'description'   : 'check if wpe-test-metrological repository is present',
            'timeout'       : 5 * 60,
            'test'          : (resp) => {
                if (fs.existsSync('./tests/resources/wpe-test-metrological/')) {
                    console.log('folder exists');
                    exec('git -C tests/resources/wpe-test-metrological/ pull', function (code, stdout, stderr) {
                        resp();
                    });
                }
                else {
                    console.log('Cloning wpe-tests into resources folder....');
                    exec('git clone git@github.com:WebPlatformForEmbedded/wpe-test-metrological.git ./tests/resources/wpe-test-metrological/', function (code, stdout, stderr) {
                        resp();
                    });
                }
            }
        },
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

                function getKey(){
                    var parsedQuery = querystring.parse(parsedUrl.query);
                    //console.log('Got key req with: ' + parsedQuery.key);
                    if (parsedQuery.key !== undefined)
                        test.keys.push(parsedQuery.key);

                    response.writeHead(200);
                    response.end();
                }

                var responseLookup = {
                    '/app'       : returnApp,
                    '/key'       : getKey,
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
        'init4' : {
            'description'   : 'Stop the WebKit Plugin',
            'test'          : stopPlugin,
            'params'        : 'WebKitBrowser'
        },
        'init5' : {
            'sleep'         : 15,
            'description'   : 'Start the WebKit Plugin',
            'test'          : startAndResumePlugin,
            'params'        : 'WebKitBrowser'
        },
        'init6' : {
            'sleep'         : 10,
            'description'   : 'Check if the WebKit Plugin is started',
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'validate'      : checkResumedOrActivated
        },
        'step1' : {
            'description'   : 'Load the app on WebKit',
            'test'          : function (x, cb) {
                var _url = `http://${test.server}:${test.port}/app?type=francetv`;
                setUrl(_url, cb);
            },
            'validate'      : httpResponseSimple
        },
        'step2' : {
            'sleep'         : 10,
            'description'   : 'Check if app is loaded on WebKit',
            'test'          : getUrl,
            'validate'      : (resp) => {
                if (resp === `http://${test.server}:${test.port}/app?type=francetv`)
                    return true;
                
                throw new Error('URL did not load on WebKit');
            }
        },
        'step3' : {
            'sleep'         : 60,
            'description'   : 'Check if screen updates',
            'test'          : screenshot,
            'validate'      : (res) => {
                // check if we got an empty response
                if (res !== undefined && res.length > 0) {
                    if ( (test.previousSceenshot === undefined) ||
                         (test.previousSceenshot !== undefined && test.previousSceenshot.equals(res) === false)
                       ) {

                        // screen updated, save it and reset stuck counter
                        test.previousSceenshot = res;
                        test.curSameScreenshot = 0;
                        return true;
                    } else {
                        // screen is stuck
                        // check if we have reached the max threshold
                        if (test.curSameScreenshot >= test.maxSameScreenshot)
                            throw new Error('Screen is stuck, new screenshot is the same as previous screenshot for ' + test.curSameScreenshot + ' times.');

                        // update counter and go again
                        test.curSameScreenshot++;
                        return true;
                    }
                } else {
                    // empty response is an annoying bug in the Snapshot module. Trying to be a little more graceful about it by allowing webbridge to return an empty screenshot from time to time
                    if (test.curSameScreenshot >= test.maxSameScreenshot)
                        throw new Error('Error screenshot returned is empty for ' + test.curSameScreenshot + ' times.');

                    // update counter and go again
                    test.curSameScreenshot++;
                    return true;
                }
            }
        },
        'step4' : {
            'description'   : 'Repeat for 3 hours',
            'goto'          : 'step3',
            'repeatTime'    : 3 * 60,
        },
        'step5' : {
            'description'   : 'Cleanup the test',
            'test'          : setUrl,
            'params'        : 'about:blank'
        }
    }
};


function readApp(callback){
    fs.readFile('./tests/resources/wpe-test-metrological/eme.html', function(err, data){
        if (err){
            throw err;
        } else {
            callback(undefined, data);
        }
    });
}
