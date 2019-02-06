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
        // setup need image messaging
        this.needImage = new NeedImage();
        this.init = new Init();

        // setup worker
        this.worker = new Worker('js/task/task.js');
        this.worker.onmessage = (message) => {
            //console.log('APP message: ', message.data);

            if (message.data.name === undefined)
                return;

            var data = message.data;

            // update view
            updateProgressCb(data);

            // additional processing
            switch (data.name) {
                case 'Init':
                    if (data.state === this.init.states.loaded) {
                        if (window.DEBUG === true)
                            this.init.setDebug();

                        this.init.initialize(this.worker);
                    }

                    if (data.state === this.init.states.initReady) {
                        //worker is ready, launch test through loadtest message
                        this.init.setLoadTest(test, host, this.worker);
                    }

                    break;

                case 'NeedImage':
                    this.loadImageData(data.url, (resp) => {
                        this.needImage.setImageData(resp.imageData.data, this.worker);
                    });
                    break;

                case 'TestMessage':
                    // clean up if we're done, just make sure were not holding on to heavy image data across tests
                    if (data.completed === true) {
                        delete this.canvas;
                        delete this.ctx;
                        delete this.image;
                        delete this.needImage.imageData;
                    }
                    break;
            }
        };
    }

    loadImageData(url, cb) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.image = new Image();
        this.image.src = url;
        this.image.crossOrigin = 'anonymous';

        let screenshot = document.getElementById('screenshot');
        if (screenshot !== undefined)
            screenshot.innerHTML = '';
            screenshot.appendChild(this.canvas);

        this.image.onload = () => {
            this.canvas.width = '300';
            this.canvas.height = '150';
            this.ctx.drawImage(this.image, 0, 0, 300, 150);
            console.debug(`Image loaded: ${this.image.width} x ${this.image.height} pixels`);
            cb({ 'imageData': this.ctx.getImageData(0, 0, this.image.width, this.image.height) });
        };

        this.image.onerror = () => {
            cb({ error: 'Could not load image' });
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
    getActiveTask()     { return this.activeTask; }
    getActiveDevces()   { return this.devices; }

}

window.classes = window.classes || {};
window.classes.Core = Core;
