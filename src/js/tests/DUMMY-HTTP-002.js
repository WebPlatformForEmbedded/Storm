/** 
 * WPETestFramework dummy test task
 */
/*jslint esnext: true*/

module.exports = {
    'title'         : 'Dummy Test',
    'description'   : 'This is a dummy HTTP server test',
    'port1'         : undefined,
    'port2'         : undefined,
    'host'            : undefined,
    'steps'         : {
        'step1' : {
            'description'   : 'Start a HTTP server',
            'timeout'       : 180, //seconds
            'test'          : startHttpServer,
            'params'        : function(request, response) {
                console.log('Got request', request.url);
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.end('Hello World!');
            },
            'validate'      : (port) => {
                console.log('HTTP Server listening on port ' + port);
                task.port1 = port;
                return true;
            }
        },
        'getIpRange0' : {
            'description'   : 'Determine IP to use',
            'test'          : matchIpRange,
            'params'        : host,
            'validate'      : (response) => {
                if (response === undefined)
                    return false;

                task.host = response;
                return true;
            }
        },       
        'step2' : {
            'description'   : 'GET the previous URL',
            'timeout'       : 180, //seconds
            'test'          : function(x, cb) {
                var params = { url: `http://${task.host}:${task.port1}`, method: 'GET' };
                http(params, cb);
            },
            'validate'      : httpResponseSimple
        },
        'step3' : {
            'description'   : 'Start another HTTP Server that returns 404',
            'timeout'       : 180,
            'test'          : startHttpServer,
            'params'        : function(request, response) {
                console.log('Got request', request.url);
                response.writeHead(404, {'Content-Type': 'text/plain'});
                response.end('Booo!');
            },
            'validate'      : (port) => {
                console.log('HTTP Server listening on port ' + port);
                task.port2 = port;
                return true;
            }
        },
        'step4' : {
            'description'   : 'GET the previous URL',
            'timeout'       : 180, //seconds
            'test'          : function(x, cb) {
                var params = { url: `http://${task.host}:${task.port2}`, method: 'GET' };
                http(params, cb);
            },
            'validate'      : (x) => {
                if (x.error) return false;
                if (x.status !== undefined && parseInt(x.status) === 404) return true;
            }
        },
    }
};
