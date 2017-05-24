/**
 * WPETestFramework test
 */
 /*jslint esnext: true*/

const fs = require('fs');
const url = require('url');
const querystring = require('querystring');
const resemble = require('node-resemble-js');

require('shelljs/global');

module.exports = {
    'title'             : 'Video resizing test',
    'description'       : 'Start a test video and resize to different sizes',
    'requiredPlugins'   : ['WebKitBrowser', 'Snapshot'],
    'port'              : undefined,
    'server'            : undefined,
    'screenshot'       : undefined,
    'steps'             : {
        'init1' : {
            'sleep'         : 10,
            'description'   : 'Load resources to start the test',
            'test'          : function(x, callback) {
                readApp((err, app) => {
                    if (err || app === undefined) 
                        callback(false);

                    task.app = '' + app;
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
                    response.end(task.app);
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

                task.port = port;
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

                task.server = response;

                // update the app to reflect what we are going to use the serve the app from
                task.app = task.app.replace(/{{server}}/g, task.server);
                task.app = task.app.replace(/{{port}}/g, task.port);

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
            'description'   : 'Start the WebKit Plugin',
            'test'          : startAndResumePlugin,
            'params'        : 'WebKitBrowser',
        },
        'step4' : {
            'sleep'         : 5,
            'description'   : 'Check if the WebKit Plugin is started',
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'validate'      : checkResumedOrActivated,
        },
        'step5' : {
            'description'   : 'Load the app on WebKit',
            'test'          : function (x, cb) {
                var _url = `http://${task.server}:${task.port}/app`;
                setUrl(_url, cb);
            },
            'validate'      : httpResponseSimple,
        },
        'step6' : {
            'sleep'         : 5,
            'description'   : 'Check if app is loaded on WebKit',
            'test'          : getUrl,
            'validate'      : (resp) => {
                if (resp === `http://${task.server}:${task.port}/app`)
                    return true;
                
                throw new Error('URL did not load on WebKit');
            }
        },
        'step7' : {
            'description'   : 'Change resolution to 320x240',
            'test'          : key,
            'params'        : '0x0021',
            'validate'      : httpResponseSimple,
        },
        'step8' : {
            'sleep'         : 3,
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
        'step9' : {
            'description'   : 'verify if the resolution change happened',
            'test'          : (cb) => {
                resemble('./tests/resources/res_320x240.png').compareTo(task.screenshot).ignoreColors().onComplete(function(data){
                    if (Number(data.misMatchPercentage) <= 0.01) {
                        cb();
                    } else {
                        /*var diffDataStream = data.getDiffImage().pack()
                        var writeStream = fs.createWriteStream('./tests/resources/diff.png');
                        diffDataStream.pipe(writeStream);*/
                        throw new Error('Screenshot differs ' + data.misMatchPercentage + '%');
                    }
                });
            }
        },
        'step10' : {
            'description'   : 'Change resolution to 640x480',
            'test'          : key,
            'params'        : '0x0022',
            'validate'      : httpResponseSimple,
        },
        'step12' : {
            'sleep'         : 3,
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
        'step13' : {
            'description'   : 'verify if the resolution change happened',
            'test'          : (cb) => {
                resemble('./tests/resources/res_640x480.png').compareTo(task.screenshot).ignoreColors().onComplete(function(data){
                    if (Number(data.misMatchPercentage) <= 0.01) {
                        cb();
                    } else {
                        /*var diffDataStream = data.getDiffImage().pack()
                        var writeStream = fs.createWriteStream('./tests/resources/diff.png');
                        diffDataStream.pipe(writeStream);*/
                        throw new Error('Screenshot differs ' + data.misMatchPercentage + '%');
                    }
                });
            }
        },
        'step14' : {
            'description'   : 'Change resolution to 1280x720',
            'test'          : key,
            'params'        : '0x0023',
            'validate'      : httpResponseSimple,
        },
        'step15' : {
            'sleep'         : 5,
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
        'step116' : {
            'description'   : 'verify if the resolution change happened',
            'test'          : (cb) => {
                resemble('./tests/resources/res_1280x720.png').compareTo(task.screenshot).ignoreColors().onComplete(function(data){
                    if (Number(data.misMatchPercentage) <= 0.01) {
                        cb();
                    } else {
                        /*var diffDataStream = data.getDiffImage().pack()
                        var writeStream = fs.createWriteStream('./tests/resources/diff.png');
                        diffDataStream.pipe(writeStream);*/
                        throw new Error('Screenshot differs ' + data.misMatchPercentage + '%');
                    }
                });
            }
        },
        'step17' : {
            'description'   : 'Change resolution to 1920x1080',
            'test'          : key,
            'params'        : '0x0024',
            'validate'      : httpResponseSimple,
        },
        'step18' : {
            'sleep'         : 5,
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
        'step119' : {
            'description'   : 'verify if the resolution change happened',
            'test'          : (cb) => {
                resemble('./tests/resources/res_1920x1080.png').compareTo(task.screenshot).ignoreColors().onComplete(function(data){
                    if (Number(data.misMatchPercentage) <= 0.01) {
                        cb();
                    } else {
                        /*var diffDataStream = data.getDiffImage().pack()
                        var writeStream = fs.createWriteStream('./tests/resources/diff.png');
                        diffDataStream.pipe(writeStream);*/
                        throw new Error('Screenshot differs ' + data.misMatchPercentage + '%');
                    }
                });
            }
        }
    },
    'cleanup'       : restartFramework
};

function readApp(callback){
    fs.readFile('./tests/resources/resize_video.html', function (err, html) {
        if (err) {
            throw err; 
        } else {
            callback(undefined, html); 
        }
    });
}