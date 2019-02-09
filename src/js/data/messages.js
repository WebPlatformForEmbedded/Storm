/*
 * base Message definitions
 *
 * send() - Sends the command over to the main thread, every message has this
 */
class Message {
    constructor() {
        this.worker;
        this.messageContext;
        this.statesToBeSynced = [];
    }

    send(message) {
        message.messageContext = this.messageContext

        // bubble up object
        if (this.worker !== undefined && this.worker.postMessage !== undefined)
            this.worker.postMessage(message);
        else
            postMessage(message);

    }

    /*
     * Serialize state
     */
    sync() {
        var _msg = {};

        for (let i=0; i<this.statesToBeSynced.length; i++) {
            let stateName = this.statesToBeSynced[i];
            _msg[ stateName ] = this[ stateName ];
        }

        this.send(_msg);
     }
}

/*
 * Individual messages and their properties
 */
// Control messages used to control the init/start flow of the worker and main applications
class Init extends Message {
    constructor(worker) {
        super();

        this.worker = worker;

        this.messageContext = 'Init';
        this.test = '';
        this.host = '';
        this.debug = false;

        this.states = {
            'initFailure'       : -1,
            'loaded'            : 0,
            'init'              : 1,
            'initReady'         : 2,
            'loadTest'          : 3,
        };

        this.state = -1;
        this.statesToBeSynced = ['test', 'state', 'host', 'debug'];
    }

    initialize()     { this.state = this.states.init;        this.sync();  }

    setInitReady()   { this.state = this.states.initReady;   this.sync();  }
    setInitFailure() { this.state = this.states.initFailure; this.sync();  }
    setDebug()       { this.debug = true; }

    setLoadTest(test, host) {
        this.test = test;
        this.host = host;
        this.state = this.states.loadTest;
        this.sync(worker);
    }
}

/*
 * Special class to have the main thread fetch the image and return the image data out of the canvas
 */
class NeedImage extends Message {
    constructor(worker) {
        super();

        this.worker = worker;

        this.messageContext = 'NeedImage';
        this.url = '';
        this.imageData = '';

        this.statesToBeSynced = ['url', 'imageData'];
    }

    setURL(url) {
        this.url = url;
        this.sync();
    }

    setImageData(data) {
        this.imageData = data;
        this.sync();
    }
}

/*
 * Special class for repeating steps within the step, not sure if this needs be merged with the main step message class
 */
class RepeatMessage extends Message {
    constructor(currentStepIdx, fromStep, toStep) {
        super();

        this.messageContext = 'RepeatMessage';
        this.stepIdx = currentStepIdx;

        this.repeat = {
            'fromStep'  : fromStep,
            'toStep'    : toStep
        };

        this.states = {
            'init'      : -1,
            'repeating' : 0,
            'done'      : 1
        };

        this.state = this.states.init;

        this.repeatByCount = {
            remaining   : null,
            total       : null,
        };

        this.repeatByTime = {
            until           : null,
            timesRepeated   : null
        };

        this.repeatTypes = {
            count   : 0,
            time    : 1
        };

        this.repeatType = this.repeatTypes.count;
        this.statesToBeSynced = ['stepIdx', 'repeat', 'state', 'repeatByCount', 'repeatByTime', 'repeatType'];
    }

    repeatCount(remaining, total) {
        this.repeatType                    = this.repeatTypes.count;
        this.state                         = this.states.repeating;

        this.repeatByCount.remaining       = remaining;
        this.repeatByCount.total           = total;
        this.sync();
    }

    timedRepeat(until, times) {
        this.repeatType                    = this.repeatTypes.time;
        this.state                         = this.states.repeating;

        this.repeatByTime.until            = until;
        this.repeatByTime.timesRepeated    = times;
        this.sync();
    }

    done() {
        this._state                         = this.states.done;
        this.sync();
    }
}
