/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

var html = '<html><head><title>Hello! This is a set url test</title></head>';
html += '<body><p style="position: absolute; left: 150px; top: 150px">Framework Set URL test</p><script>';
html += 'console.log("Page loaded succesfully");\n';
html += '</script></body></html>';

function ServeApp1(request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    task.appLoaded1 = true;
    response.end(html);
}

function ServeApp2(request, response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    task.appLoaded2 = true;
    response.end(html);
}

test = {
    'title'         : 'Framework stability set URL test',
    'description'   : 'Stress loads the system by setting the URL in a loop and see if the Framework process continues to operate nominally',
    'ip'            : undefined,
    'server1'       : undefined,
    'server2'       : undefined,
    'server3'       : undefined,
    'appLoaded1'    : false,
    'appLoaded2'    : false,
    'appLoaded3'    : false,
    'steps'         : {
        'init1' : {
            'description'   : 'Start HTTP server1, serve the app',
            'timeout'       : 180, //seconds
            'test'          : startHttpServer,
            'params'        : function (request, response) {
                response.writeHead(200, {'Content-Type': 'text/html'});
                console.log('Got request on server1');
                task.appLoaded1 = true;
                response.end(html);
            },
            'validate'      : (port) => {
                if (port === null || port === undefined)
                    return false;

                task.server1 = port;
                return true;
            }
        },
        'init2' : {
            'description'   : 'Start HTTP server2, serve the app',
            'timeout'       : 180, //seconds
            'test'          : startHttpServer,
            'params'        : function (request, response) {
                response.writeHead(200, {'Content-Type': 'text/html'});
                console.log('Got request on server2');
                task.appLoaded2 = true;
                response.end(html);
            },
            'validate'      : (port) => {
                if (port === null || port === undefined)
                    return false;

                task.server2 = port;
                return true;
            }
        },
        'init3' : {
            'description'   : 'Start HTTP server3, serve the app',
            'timeout'       : 180, //seconds
            'test'          : startHttpServer,
            'params'        : function (request, response) {
                response.writeHead(200, {'Content-Type': 'text/html'});
                console.log('Got request on server3');
                task.appLoaded3 = true;
                response.end(html);
            },
            'validate'      : (port) => {
                if (port === null || port === undefined)
                    return false;

                task.server3 = port;
                return true;
            }
        },
        'init4' : {
            'description'   : 'Determine IP to use',
            'test'          : matchIpRange,
            'params'        : host,
            'validate'      : (response) => {
                if (response === undefined)
                    return false;

                task.ip = response;
                return true;
            }
        },
        'init5' : {
            'description'   : 'Stop the WPEWebkit Plugin',
            'test'          : stopPlugin,
            'params'        : 'WebKitBrowser'
        },
        'init6' : {
            'sleep'         : 30,
            'description'   : 'Start the WPEWebkit Plugin',
            'test'          : startAndResumePlugin,
            'params'        : 'WebKitBrowser'
        },
        'init7' : {
            'sleep'         : 30,
            'description'   : 'Check if the WPEWebkit Plugin is started',
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'validate'      : checkResumedOrActivated
        },
        'step1' : {
            'description'   : 'Load 3 different urls on WPEWebkit in a very short sequence',
            'test'          : function (x, cb) {
                var url1 = `http://${task.ip}:${task.server1}/app`;
                var url2 = `http://${task.ip}:${task.server2}/app`;
                var url3 = `http://${task.ip}:${task.server3}/app`;

                setUrl(url1)
                setTimeout(setUrl, 1000, url2);
                setTimeout(setUrl, 2000, url3, cb);
            },
        },
        'step2' : {
            'sleep'         : 5,
            'description'   : 'Check if all apps are loaded on WPEWebkit',
            'test'          : (x, cb) => {
                cb(`app1: ${task.appLoaded1}, app2: ${task.appLoaded2}, app3: ${task.appLoaded3}`);
            },
            'validate'      : () => {
                if (task.appLoaded1 === true && task.appLoaded2 === true && task.appLoaded3 === true){
                    task.appLoaded1 = false;
                    task.appLoaded2 = false;
                    task.appLoaded3 = false;
                    return true;
                }

                throw new Error(`App(s) did not load on WPEWebkit, app1: ${task.appLoaded1}, app2: ${task.appLoaded2}, app3: ${task.appLoaded3}`);
            }
        },
        'step3' : {
            'description'   : 'Repeat setURL for 100 times',
            'goto'          : 'step1',
            'repeat'        : 100
        }
    },
    'cleanup'       : restartFramework
};
