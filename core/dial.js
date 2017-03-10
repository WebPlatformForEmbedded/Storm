/**
 * WPETestFramework test dial class
 */
/*jslint esnext: true*/

const dial = require('peer-dial');
const dialClient = new dial.Client();
const URL = require('url');
const parseString = require('xml2js').parseString;

const DISCOVER_TIME = 10000;

module.exports = {
    dialDiscover(x, cb) {
        var devices = [];
        console.log('Doing dial discovery');
        dialClient.on('ready', () => {
            console.log('Dial client ready');
        }).on('found', function(deviceDescriptionUrl, ssdpHeaders) {
            var deviceDescriptionUrlParsed = URL.parse(deviceDescriptionUrl);
            console.log('Device found @ ' + URL.parse(deviceDescriptionUrl).host);
            console.log(deviceDescriptionUrl);

            dialClient.getDialDevice(deviceDescriptionUrl, function(dialDevice, err) {
                if (dialDevice !== undefined) {
                    dialDevice.URL = URL.parse(deviceDescriptionUrl);

                    // add it to our array
                    devices.push(dialDevice);
                } else if (err) {
                    console.error("Error on get DIAL device description from ", deviceDescriptionUrl, err);
                }
            });
        }).start();

        function _stopAndCallback() {
            dialClient.stop();
            cb(devices);
        }

        setTimeout(_stopAndCallback, DISCOVER_TIME);
    },
    dialGetApp(app, cb) {
        var opts = {
            url     : `http://${host}:8080/Service/DIALServer/Apps/${app}`,
            method  : 'GET'
        };
        http(opts, (response) => {
            parseString(response.body, function(err, result) {
                var parsedRes = JSON.parse(JSON.stringify(result));
                cb(parsedRes);
            });
        });
    },
    dialState(app, cb) {
        dialGetApp(app, (response) => {
            cb(response.service.state[0]);
        });
    },
    dialStart(app, cb) {
        var opts = {
            url     : `http://${host}:8080/Service/DIALServer/Apps/${app}`,
            method  : 'POST'
        };
        http(opts, cb);
    },
    dialStartWithBody(options, cb) {
        var opts = {
            url     : `http://${host}:8080/Service/DIALServer/Apps/${options.app}`,
            method  : 'POST',
            body    : options.body
        };
        http(opts, cb);
    },
    dialStop(app, cb) {
        var opts = {
            url     : `http://${host}:8080/Service/DIALServer/Apps/${app}`,
            method  : 'DELETE'
        };
        http(opts, cb);
    }
};
