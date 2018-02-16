/**
 * WPETestFramework test base class
 */

/** Device info plugin provides device specific information, such as cpu usage and serial numbers */
class Base extends BasePlugin {

    constructor() {
        this.priority = 1;
    }

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

        var xmlHttp = new XMLHttpRequest();      
        //console.log(method + ' ' + URL + (body!==null ? '\n' + body : ''));

        // iterate over the headers provided and set them individually. Unfortunately node accepted an object, xmlhttp request individual sets
        if (options.headers) {
            var headerList = Object.keys(options.headers);
            for (var i=0; i<headerList.length; i++) {
                xmlHttp.setRequestHeader(headerList[i], options.headers[ headerList[i] ]);
            }
        }

        xmlHttp.open(method, URL, true);
        if (cb) {
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4) {
                    if (xmlHttp.status >= 200 && xmlHttp.status <= 299) {
                        //console.log('RESP: ', resp);
                        cb({ 'headers' : xmlHttp.getAllResponseHeaders(), 'body' : xmlHttp.responseText, 'status' : xmlHttp.status, 'statusMessage' : xmlHttp.statusText });
                    } else if (xmlHttp.status >= 300) {
                        //console.log('ERR: ' + xmlHttp.responseText);
                        cb({ 'error' : `HTTP Status ${xmlHttp.status}, with message: ${xmlHttp.statusMessage}` });
                    } else if (xmlHttp.status === 0) {
                        //console.log('ERR: connection interrupted');
                        cb({ 'error' : 'Connection interrupted' });
                    }
                }
            };

            xmlHttp.ontimeout = function () {
                callback({ 'error' : 'Connection timed out'});
            };
        }
        if (body !== null)
            xmlHttp.send(body);
        else
            xmlHttp.send();

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
        throw Error('This is no logner supported in the web version, please point your test to the webserver instead');
    },

    startFileServer(cb) {
        throw Error('This is no longer supported in the web version, please point your test to the webserver instead');
    },

    matchIpRange(ip, cb) {
        throw Error('This is no longer supported in the web version, local server support is disabled. Please update your test');
    }

}

window.coreClasses = window.coreClasses || {};
window.coreClasses.Base = Base;
