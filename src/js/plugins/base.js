/**
 * WPETestFramework test base class. Provides base functionality to be used in the Tests
 */
class Base {
    constructor() {
        this.host = null;

        this.dummy = this.dummy.bind(this);
        this.sleep = this.sleep.bind(this);
        this.get = this.get.bind(this);
        this.http = this.http.bind(this);
        this.httpResponseSimple = this.httpResponseSimple.bind(this);
        this.httpResponseBody = this.httpResponseBody.bind(this);
        this.jsonParse = this.jsonParse.bind(this);
        this.checkIfObject = this.checkIfObject.bind(this);
        this.startHttpServer = this.startHttpServer.bind(this);
        this.startFileServer = this.startFileServer.bind(this);
        this.matchIpRange = this.matchIpRange.bind(this);
    }

    /* Dummy function simply returns provided callback. Used internally by dummy tests to validate the framework */
    dummy(x, cb) {
        cb(x);
    }

    /** Sleep waits X amounts of seconds
     * @param {int} x - Time to sleep in seconds
     * @param {function} cb - Callback after sleep is done
     */
    sleep(x, cb) {
        this.setTimeout(cb, x * 1000);
    }

    /** HTTP GET a specific URL
    * @param {string} url - URL that needs to be retrieved
    * @param {function} cb - Callback with the results of the GET. See HTTP for more information.
    */
    get(url, cb) {
        this.http({
            'url' : url,
            'method' : 'GET',
            'body' : null
        }, cb);
    }

    /** HTTP GET a specific URL
    * @param {options} options - Object with the following properties:
    * @param {string} options.url - Url to be called
    * @param {string} options.method - Method to be used, GET/POST/PUT/DELETE
    * @param {string} options.body - Optional body to be sent in the request (note only useful for PUT/POST)
    * @param {function} cb - Callback with the results of the GET.
    * @returns {object} response - Returns a response object
    * @returns {string} response.error -  Returns an error string if the request failed
    * @returns {string} response.headers - Return headers from the response
    * @returns {string} response.body - Body of the response
    * @returns {string} response.status - HTTP status code for the response
    * @returns {string} response.statusMessage - HTTP Status message for the response
    */
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

        xmlHttp.open(method, url, true);
        if (cb) {
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4) {
                    if (xmlHttp.status >= 200 && xmlHttp.status <= 299) {
                        //console.log('RESP: ', resp);
                        cb({ 'headers' : xmlHttp.getAllResponseHeaders(), 'body' : xmlHttp.responseText, 'status' : xmlHttp.status, 'statusMessage' : xmlHttp.statusText });
                    } else if (xmlHttp.status >= 300) {
                        //console.log('ERR: ' + xmlHttp.responseText);
                        cb({ 'error' : `HTTP Status ${xmlHttp.status}${XMLHttpRequest.statusMessage !== undefined ? `, with message: ${xmlHttp.statusMessage}` : '' }`});
                    } else if (xmlHttp.status === 0) {
                        //console.log('ERR: connection interrupted');
                        cb({ 'error' : 'Connection interrupted' });
                    }
                }
            };

            xmlHttp.ontimeout = function () {
                cb({ 'error' : 'Connection timed out'});
            };
        }
        if (body !== null)
            xmlHttp.send(body);
        else
            xmlHttp.send();

    }

    /** Check the response of HTTP. Utility function that checks if the response status was < 400
    * @param {object} url - HTTP response object
    * @returns {boolean} Returns true if correct, throws error if it has an error
    */
    httpResponseSimple(x) {
        if (x.error) throw new Error(x.error);
        if (x.status !== undefined && parseInt(x.status) < 400)
            return true;
        else
            throw new Error('Framework returned with a HTTP code > 400');
    }

    /** Check the response of HTTP. Utility function that checks if the response status was < 400 and has a body
    * @param {object} url - HTTP response object
    * @returns {boolean} Returns true if correct, throws error if it has an error
    */
    httpResponseBody(x) {
        if (x.error) throw new Error(x.error);
        if (x.status !== undefined && parseInt(x.status) < 400 && x.body !== undefined)
            return true;
        else
            throw new Error('Framework returned with a HTTP code > 400 or no body (yet expected)');
    }

    /** Checks if the response can be parsed using JSON
    * @param {string} x - JSON string object
    * @param {function} cb - Callback function
    * @returns {boolean} Returns if correct, throws error if it has an error
    */
    jsonParse(x, cb) {
        try {
            var y = JSON.parse(x);
            cb(y);
        } catch (e) {
            throw new Error('Error parsing json at jsonParse step');
        }
    }

    /** Check if the response is an object
    * @param {object} x - object
    * @returns {boolean} Returns true if correct, throws error if it has an error
    */
    checkIfObject(x) {
        if (typeof x === 'object')
            return true;
        else
            throw new Error(`${x} is not an Object`);
    }

    /** Deprecated startHttpServer */
    startHttpServer(requestFunction, cb) {
        throw Error('This is no longer supported in the web version, please point your test to the webserver instead');
    }

    /** Deprecated startFileServer */
    startFileServer(cb) {
        throw Error('This is no longer supported in the web version, please point your test to the webserver instead');
    }

    /** Deprecated matchIpRange */
    matchIpRange(ip, cb) {
        throw Error('This is no longer supported in the web version, local server support is disabled. Please update your test');
    }
}

window.plugins = window.plugins || {};
window.plugins.Base = Base;
