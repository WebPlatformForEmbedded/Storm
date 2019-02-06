/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

var keyMap = {
    13: '0x002B', // enter
    37: '0x0003', // left
    38: '0x0001', // up
    39: '0x0004', // right
    40: '0x0002', // down
    27: '0x0009', // esc
    8: '0x0032', // backspace
    48: '0x0020', // 0
    49: '0x0021', // 1
    50: '0x0022', // 2
    51: '0x0023', // 3
    52: '0x0024', // 4
    53: '0x0025', // 5
    54: '0x0026', // 6
    55: '0x0027', // 7
    56: '0x0028', // 8
    57: '0x0029', // 9
    33: '0x0030', // page up
    34: '0x0031', // page down
    65: '0x8004', // a
    66: '0x8005', // b
    67: '0x8006', // c
    68: '0x8007', // d
    69: '0x8008', // e
    70: '0x8009', // f
    71: '0x800A', // g
    72: '0x800B', // h
    73: '0x800C', // i
    74: '0x800D', // j
    75: '0x800E', // k
    76: '0x800F', // l
    77: '0x8010', // m
    78: '0x8011', // n
    79: '0x8012', // o
    80: '0x8013', // p
    81: '0x8014', // q
    82: '0x8015', // r
    83: '0x8016', // s
    84: '0x8017', // t
    85: '0x8018', // u
    86: '0x8019', // v
    87: '0x801A', // w
    88: '0x801B', // x
    89: '0x801C', // y
    90: '0x801D', // z
    46: '0x802A', // delete
    32: '0x802C', // space
    189: '0x802D', // minus
    187: '0x802E', // equal
    220: '0x8031', // backslash
    186: '0x8033', // semicolon
    222: '0x8034', // apostrophe
    188: '0x8036', // comma
    190: '0x8037', // dot
    191: '0x8038'  // slash
};
var keyMapArray = Object.keys(keyMap);
var keyMapLength = keyMapArray.length;

module.exports = {
    'title'             : 'Remote control keys test',
    'description'       : 'sends and verifies key through the remote control plugin',
    'requiredPlugins'   : ['RemoteControl', 'WebKitBrowser'],
    'port'              : undefined,
    'server'            : undefined,
    'keyindex'          : 0,
    'expectedKey'       : undefined,
    'key'               : undefined,
    'steps'             : {
        'init1' : {
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
                        test.key  = parsedQuery.key;

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
            'description'   : 'Stop the WPEWebkit Plugin',
            'test'          : stopPlugin,
            'params'        : 'WebKitBrowser'
        },
        'init5' : {
            'sleep'         : 5,
            'description'   : 'Start the WPEWebkit Plugin',
            'test'          : startAndResumePlugin,
            'params'        : 'WebKitBrowser'
        },
        'init6' : {
            'sleep'         : 5,
            'description'   : 'Check if the WPEWebkit Plugin is started',
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'validate'      : checkResumedOrActivated
        },
        'init7' : {
            'description'   : 'Load the app on WPEWebkit',
            'test'          : function (x, cb) {
                var _url = `http://${test.server}:${test.port}/app`;
                setUrl(_url, cb);
            },
            'validate'      : httpResponseSimple
        },
        'init8' : {
            'sleep'         : 5,
            'description'   : 'Check if app is loaded on WPEWebkit',
            'test'          : getUrl,
            'validate'      : (resp) => {
                if (resp === `http://${test.server}:${test.port}/app`)
                    return true;
                
                throw new Error('URL did not load on WPEWebkit');
            }
        },
        'step1' : {
            'description'   : 'stop remote control plugin',
            'test'          : stopPlugin,
            'params'        : 'RemoteControl',
            'validate'      : httpResponseSimple,
        },
        'step2' : {
            'sleep'         : 5,
            'description'   : 'start remote control plugin',
            'test'          : startPlugin,
            'params'        : 'RemoteControl',
            'validate'      : httpResponseSimple,
        },
        'step3' : {
            'sleep'         : 5,
            'description'   : 'send key to remote control plugin',
            'test'          : (cb) => {

                var currentJSKey = keyMapArray[test.keyindex];
                var hexKey = keyMap[ currentJSKey ];
                setTimeout(key, 250, hexKey, (resp) => { setTimeout(cb, 2000) });

                //console.log(currentJSKey);
                //console.log(hexKey);

                test.expectedKey = currentJSKey;
                test.keyindex++;
            },
            'validate'      : () => {

                console.log(test.expectedKey);
                console.log(test.key);

                if (test.key === test.expectedKey)
                    return true;

                throw new Error(`Key did not match, expected ${test.expectedKey} and got ${test.key}`);
            }
        },
        'step4' : {
            'description'   : 'repeat send key step',
            'goto'          : 'step3',
            'repeat'        : keyMapLength,
        }
    }
};

function readApp(callback){
    fs.readFile('./tests/resources/key_app.html', function(err, data){
        if (err){
            throw err;
        } else {
            callback(undefined, data);
        }
    });
}