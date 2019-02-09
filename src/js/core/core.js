/**
 * WPE Test Framework core.js
 *
 * The core provides the ability to run tests in web workers, interface with a local agent (if available) and
 * collect test results.
 */

class Core {
    constructor() {
        this.activeTest = '';
        this.deviceid = null;
        this.devicename = null;
        this.dummyMode = false;
        this.results = {};
        this.tests = [];
        this.version = null;
        this.worker = null;
        this.testProgressListeners = [];

        // public
        this.activateDevice = this.activateDevice.bind(this);
        this.deleteDevice = this.deleteDevice.bind(this);
        this.getScreenshotCanvas = this.getScreenshotCanvas.bind(this);
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

    run(test) {
        // setup need image messaging
        this.activeTest = test;

        // setup worker
        this.worker = new Worker('js/task/task.js');

        this.needImage = new NeedImage(this.worker);
        this.init = new Init(this.worker);

        this.worker.onmessage = (message) => {
            console.log('APP message: ', message.data);

            var data = message.data;

            // additional processing
            switch (data.messageContext) {
                case 'Init':
                    if (data.state === this.init.states.loaded) {
                        if (window.DEBUG === true)
                            this.init.setDebug();

                        this.init.initialize();
                    }

                    if (data.state === this.init.states.initReady) {
                        //worker is ready, launch test through loadtest message
                        this.init.setLoadTest(this.activeTest, host);
                    }

                    break;

                case 'NeedImage':
                    this.loadImageData(data.url, (resp) => {
                        this.needImage.setImageData(resp.imageData.data);
                    });
                    break;


                // sync datamodel here
                case 'TestMessage':
                    if (data.name === undefined)
                        return;

                    let _testToSync = wtf.tests[ data.name ];

                    this._syncDataObjects(_testToSync, data);

                    // clean up if we're done, just make sure were not holding on to heavy image data across tests
                    if (data.completed === true) {
                        delete this.canvas;
                        delete this.ctx;
                        delete this.image;
                        delete this.needImage.imageData;
                    }
                    break;

                case 'StepMessage':
                    if (data.name === undefined || data.testName === undefined)
                        return;

                    let _testThatbelongsToStep = wtf.tests[ data.testName ];
                    let _stepToSync = _testThatbelongsToStep.steps[ data.name ];

                    _testThatbelongsToStep.currentStep = data.name;

                    this._syncDataObjects(_stepToSync, data);
                    break;
            }

            // update listeners
            for (var i=0; i<this.testProgressListeners.length; i++)
                testProgressListeners[i](data);

        };
    }

    _syncDataObjects(orgObject, newObject) {
        for (let j=0; j<orgObject.statesToBeSynced.length; j++){
            let objectName = orgObject.statesToBeSynced[j];
            let objectToSync = newObject[ objectName ];

            if (objectToSync === undefined)
                continue;

            orgObject[ objectName ] = objectToSync;
        }
    }

    registerForTestProgress(callback) {
        this.testProgressListeners.push(callback);
    }

    deregisterForTestProgress(fn) {
        var index = this.testProgressListeners.indexOf(fn);
        if (index > -1) {
           this.testProgressListeners.splice(index, 1);
        }
    }

    loadImageData(url, cb) {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.image = new Image();
        this.image.src = url;
        this.image.crossOrigin = 'anonymous';

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

    getScreenshotCanvas() {
        return this.canvas;
    }

    // Getters
    getDeviceDetails()  { return { 'devicename' : this.devicename, 'deviceid' : this.deviceid, 'version': this.version }; }
    getActiveTask()     { return this.activeTask; }
    getActiveDevces()   { return this.devices; }

}

window.classes = window.classes || {};
window.classes.Core = Core;
