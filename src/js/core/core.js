/**
 * WPE Test Framework core.js
 *
 * The core provides the ability to run tests in web workers, interface with a local agent (if available) and
 * collect test results.
 */

class Core {
    constructor() {
        this.activeTask = '';
        this.results = {};
        this.version = null;
        this.deviceid = null;
        this.devicename = null;
        this.dummyMode = false;
        this.tests = [];
        this.worker = null;

        // public
        this.activateDevice = this.activateDevice.bind(this);
        this.deleteDevice = this.deleteDevice.bind(this);
        this.loadTest = this.loadTest.bind(this);
        this.run = this.run.bind(this);
    }

    /**
     *  Will attempt to on-board a device, get basic statics required to start collecting test results
     */
    activateDevice(host, cb) {
        // Special case for dummy mode, allows testing of the framework without the need for a real device
        if (this.dummyMode == true) {
            this.host = '127.0.0.1';
            this.devicename = 'rpi2';
            this.deviceid = 'device0';
            this.version = '1.0';

            cb({
                devicename : this.devicename,
                deviceid : this.deviceid,
                version: this.version
            });
            return;
        }


        // normal handling
        window.host = host;
        getPlugin('DeviceInfo', (resp) => {
            if (resp.error !== undefined) {
                cb({ 'error': 'Error activating device, could not load DeviceInfo' });
                return;
            }

            var deviceInfo = JSON.parse(resp.body);

            if (deviceInfo.systeminfo !== undefined) {
                this.devicename = deviceInfo.systeminfo.devicename;
                this.deviceid = deviceInfo.systeminfo.deviceid;
                this.version = deviceInfo.systeminfo.version;
            }

            console.log('Got device info response, using deviceid: ' + this.deviceid);
            console.log('Found firmware version: ' + this.version);
            console.log('Using name:' + this.devicename);

            cb({
                devicename : this.devicename,
                deviceid : this.deviceid,
                version: this.version
            });
        });
    }

    /**
     * Removes a device from the active device memory
     */
    deleteDevice() {
        delete this._host;
        delete this.version;
        delete this.serialnumber;
        return;
    }

    /**
     * Run spawns a webworker task.js which will execute the task selected
     */

    run(test, updateProgressCb) {
        this.worker = new Worker('js/task/task.js');
        this.worker.onmessage = (message) => {
            //console.log('APP message: ', message.data);

            if (message.data.name === undefined)
                return;

            var data = message.data;
            switch (data.name) {
                case 'InitReady':
                    //worker is ready, launch test through loadtest message
                    var _loadTest = new InitReady();
                    _loadTest.loadTest(test);
                    _loadTest.send(this.worker);
                    break;

                default:
                    updateProgressCb(data);
            }
        };
    }

    loadTest(url, cb) {
        get(url, (resp) => {
            if (resp.error) {
                cb(resp);
                return;
            }

            var test;
            try {
                // jshint, rightfully so, warns about eval being evil. We're using it conciously.
                /* jshint ignore:start */
                test = eval(resp.body);
                /* jshint ignore:end */
            } catch(e) {
                cb({ 'error' : e.message });
                return;
            }

            cb({ 'test' :  test });
        });
    }

    // Getters
    getDeviceDetails()  { return { 'devicename' : this.devicename, 'deviceid' : this.deviceid, 'version': this.version }; }
    getHost()           { return this.host; }
    getActiveTask()     { return this.activeTask; }
    getActiveDevces()   { return this.devices; }

}

window.classes = window.classes || {};
window.classes.Core = Core;
