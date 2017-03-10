/**
 * WPETestFramework test base class
 */
/*jslint esnext: true*/

const URL = require('url');
const http = require('http');
const os = require('os');
const path = require('path');
const httpServer = require('http-server');

module.exports = {
    dummy(x, cb) {
        cb(x);
    },
    sleep(x, cb) {
        setTimeout(cb, x * 1000);
    },
    http(options, cb) {
        var url = options.url;
        var method = options.method;
        var body = options.body;
        var parsedUrl = URL.parse(url);
        var opts = {
            host: parsedUrl.hostname,
            port: parsedUrl.port,
            path: parsedUrl.path,
            method: method,
            headers: options.headers
        };

        var req = http.request(opts, function(res) {
            var response = "";
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                response += chunk;
            });
            res.on('end', function() {
                if (cb) cb({ 'body' : response, 'status' : res.statusCode });
            });
        }).on('error', function(err) {
            if (cb) cb({ 'error' : err });
        });
        if (body) req.write(body);
        req.end();
    },
    httpResponseSimple(x) {
        if (x.error) throw new Error(x.error);
        if (x.status !== undefined && parseInt(x.status) < 400)
            return true;
        else
            throw new Error('Framework returned with a HTTP code > 400');
    },
    httpResponseBody(x) {
        if (x.error) throw new Error(x.error);
        if (x.status !== undefined && parseInt(x.status) < 400 && x.body !== undefined)
            return true;
        else
            throw new Error('Framework returned with a HTTP code > 400 or no body (yet expected)');
    },
    jsonParse(x, cb) {
        try {
            var y = JSON.parse(x);
            cb(y);
        } catch (e) {
            throw new Error('Error parsing json at jsonParse step');
        }
    },
    checkIfObject(x) {
        if (typeof x === 'object')
            return true;
        else
            throw new Error(`${x} is not an Object`);
    },
    startHttpServer(requestFunction, cb) {
        server = http.createServer(requestFunction);
        // use 0 to get a system assigned port
        server.listen(() => {
            cb(server.address().port);
        });
    },
    startFileServer(cb) {
        resources = path.join(__dirname, '../tests/resources');
        fileServer = httpServer.createServer({
            root: resources,
            robots: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            }
        });
        cb(fileServer.listen(8080));
    },
    matchIpRange(ip, cb) {
        var localInterfaces = os.networkInterfaces();
        var parsedIp = ip.split('.');
        var interfaceList = Object.keys(localInterfaces);

        // using a label to break out of an outerloop (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/label) ..... I know right?
        loop1 :
        for (var i=0; i<interfaceList.length; i++){
            var interface = localInterfaces[ interfaceList[i] ];

            loop2 :
            for (var k=0; k<interface.length; k++){
                if (interface[k].family === 'IPv6') continue; //not supporting IPv6, this shouldn't be called in IPv6 mode as there is no need for private/lan ranges anymore

                if (interface[k].address !== undefined) {
                    var parsedLocalIp = interface[k].address.split('.');

                    if (parsedIp[0] === parsedLocalIp[0] &&
                        parsedIp[1] === parsedLocalIp[1] &&
                        parsedIp[2] === parsedLocalIp[2]) {
                        cb(interface[k].address);
                        break loop1;
                    }
                }
            }

            if (i === interfaceList.length-1)
                throw new Error('Could not determine IP network of the server that belongs to: ' + ip);
        }
    }
};
