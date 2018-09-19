/**
 * WPETestFramework remote webinspector class
 */

/**
 * Attaches to the remote WebInspector to retrieve the console logs
 * NOTE: Only 1 webinspector connection can be made per host/agent, limited by the wpe webinspector itself
 */
class AttachToLogs {

    constructor(cb) {
        this.cb     = cb;
        this.ws     = undefined;
    }

    connect(c){
        this.ws = new WebSocket(`ws://${host}:9998/devtools/page/1`);

        this.ws.addEventListener('open', () => {
            // Only subscribe to Console.enable messages
            this.ws.send('{"id":1,"method":"Inspector.enable"}');
            this.ws.send('{"id":22,"method":"Console.enable"}');
            this.ws.send('{"id":23,"method":"Inspector.initialized"}');
            c();
        });

        this.ws.addEventListener('message',  (data) => {
            var m = JSON.parse(data);

          /*
            Sample message from Console.messageAdded method:
            {"method":"Console.messageAdded",
                "params":{
                    "message":{
                    "source":"console-api","level":"log","text":"TestExecutor:  All tests are completed ","type":"log","line":122,"column":16,"url":"http://yt-dash-mse-test.commondatastorage.googleapis.com/unit-tests/js/harness/main-20170816122039.js","repeatCount":1,
                    "parameters":[{"type":"string","value":"TestExecutor:  All tests are completed "}],"stackTrace":[{"functionName":"LOG","url":"http://yt-dash-mse-test.commondatastorage.googleapis.com/unit-tests/js/harness/main-20170816122039.js","scriptId":"2","lineNumber":122,"columnNumber":16},{"functionName":"log","url":"http://yt-dash-mse-test.commondatastorage.googleapis.com/unit-tests/js/harness/test-20170816122039.js","scriptId":"3","lineNumber":135,"columnNumber":12},{"functionName":"onfinished","url":"http://yt-dash-mse-test.commondatastorage.googleapis.com/unit-tests/js/harness/test-20170816122039.js","scriptId":"3","lineNumber":277,"columnNumber":13},{"functionName":"startNextTest","url":"http://yt-dash-mse-test.commondatastorage.googleapis.com/unit-tests/js/harness/test-20170816122039.js","scriptId":"3","lineNumber":326,"columnNumber":20},{"functionName":"","url":"[native code]","scriptId":"0","lineNumber":0,"columnNumber":0}]}}}
          */

            if (m.method === 'Console.messageAdded')
                this.cb(null, m.params.message.text);
        });

        this.ws.addEventListener('error', (e) => {
            throw Error(e);
        });

        this.ws.addEventListener('close', () => {
            console.log('connection closed');
        });
    }

    disconnect() {
        console.log('Closing attachToLogs websocket connection');
        if (this.ws) this.ws.close();
    }

}

window.plugins = window.plugins || {};
window.plugins.AttachToLogs = AttachToLogs;
