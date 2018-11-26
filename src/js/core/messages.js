/** The message class is used for messaging between main app and worker thread */

/*
 * base Message definitions
 *
 * send() - Sends the command over to the main thread, every message has this
 */
class Message {
    constructor() {
        this.verbose = false;
    }

    send(worker) {
        if (this.verbose === true) console.log(`${this.type()} \t ${JSON.stringify(this)}`);

        // bubble up object
        if (worker !== undefined && worker.postMessage !== undefined)
            worker.postMessage(this);
        else
            postMessage(this);

    }
}

/*
 * Individual messages and their properties
 */
// Control messages used to control the init/start flow of the worker and main applications
class InitReady extends Message {
    constructor() {
        super();

        this.name = 'InitReady';
        this.test = '';
    }

    ready() { this.send(); }
    loadTest(test) { this.test = test; this.send(); }
}
/*
class LoadTest extends Message {
    get testName() { return this.testName; }
}*/

/*
 * This is the main task message object, it covers the entire task that needs to be executed (i.e. TEST that needs to be run) from start to finish
 */
class TestMessage extends Message {
    constructor() {
        super();

        this.name = 'TestMessage';

        this.stepCount = 0;
        this.result = '';
        this.cleanup = false;
        this.cleanupResult = '';

        this.completed = false;

        // available states
        this.states = {
            'init'          : -1,
            'start'         : 0,
            'timedout'      : 1,
            'error'         : 2,
            'success'       : 3,
            'notapplicable' : 4,
        };

        this.state = this.states.init;
    }

    setStepCount(s) {
        this.stepCount = s;
    }

    start() {
        this.state = this.states.start;
        this.send();
    }

    error(e)    {
        this.state = this.states.error;
        this.result = e;
        this.send();
    }

    timedout(e) {
        this.state = this.states.timedout;
        this.result = e;
        this.send();
    }

    success(e) {
        this.state = this.states.success;
        this.result = e;
        this.send();
    }

    notApplicable(e) {
        this.state = this.states.notapplicable;
        this.result = e;
        this.send();
    }

    complete(e) {
        this.completed = true;
        this.send();
    }

    cleanedup(e) {
        this.cleanup = 'true';
        this.cleanupResult = e;
        this.send();
    }

}

/*
 * For every step executed there is a step message that controls the flow of start->fail or success.
 * System or user responses are capturedin the response field to debug issues later on in time when the test is completed
 */
class StepMessage extends Message {
    constructor(stepIdx) {
        super();

        this.name = 'StepMessage';

        this.stepIdx   = stepIdx;
        this.response  = null;
        this.result    = null;

        this.states = {
            'init'      : -1,
            'start'     : 0,
            'response'  : 1,
            'success'   : 2,
            'failed'    : 3,
            'needuser'  : 4
        };

        this.state         = this.states.init;
    }

    start()         {
        this.state     = this.states.start;
        this.send();
    }

    setResponse(resp)  {
        this.state     = this.states.response;
        this.response  = resp;
    }

    success(r) {
        this.state     = this.states.success;
        this.result    = r;
        this.send();
    }

    fail(f) {
        this.state     = this.states.failed;
        this.result    = f;
        this.send();
    }

    needUser() {
        this._state     = this.states.needuser;
        this.send();
    }
}

/*
 * Special class for repeating steps within the step, not sure if this needs be merged with the main step message class
 */
class RepeatMessage extends Message {
    constructor(currentStepIdx, fromStep, toStep) {
        super();

        this.name = 'RepeatMessage';
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
    }

    repeatCount(remaining, total) {
        this.repeatType                    = this.repeatTypes.count;
        this.state                         = this.states.repeating;

        this.repeatByCount.remaining       = remaining;
        this.repeatByCount.total           = total;
        this.send();
    }

    timedRepeat(until, times) {
        this.repeatType                    = this.repeatTypes.time;
        this.state                         = this.states.repeating;

        this.repeatByTime.until            = until;
        this.repeatByTime.timesRepeated    = times;
        this.send();
    }

    done() {
        this._state                         = this.states.done;
        this.send();
    }
}
