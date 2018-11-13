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
class TaskMessage extends Message {
    constructor() {
        super();

        this.name = 'TaskMessage';

        this._stepCount = 0;
        this._result = '';
        this._cleanup = false;
        this._cleanupResult = '';

        this._completed = false;

        // available states
        this.states = {
            'init'          : -1,
            'start'         : 0,
            'timedout'      : 1,
            'error'         : 2,
            'success'       : 3,
            'notapplicable' : 4,
        };

        this._state = this.states.init;
    }

    get cleanupResult() { return this.cleanupResult; }
    get result()        { return this.result; }
    get state()         { return this.state; }
    get stepCount()     { return this._stepCount; }
    get completed()     { return this.completed; }

    set state(s)        { this.state = s; }
    set result(r)       { this.result = r; }

    set stepCount(s)    {
        this._stepCount = s;
        this.send();
    }

    start() {
        this._state = this.states.start;
        this.send();
    }

    error(e)    {
        this._state = this.states.error;
        this._result = e;
        this.send();
    }

    timedout(e) {
        this._state = this.states.timedout;
        this._result = e;
        this.send();
    }

    success(e) {
        this._state = this.states.success;
        this._result = e;
        this.send();
    }

    notApplicable(e) {
        this._state = this.states.notapplicable;
        this._result = e;
        this.send();
    }

    set completed(e) {
        this._completed = true;
        this.send();
    }

    cleanup(e) {
        this._cleanup = 'true';
        this._cleanupResult = e;
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

        this._stepIdx   = stepIdx;
        this._response  = null;
        this._result    = null;

        this.states = {
            'init'      : -1,
            'start'     : 0,
            'response'  : 1,
            'success'   : 2,
            'failed'    : 3,
            'needuser'  : 4
        };

        this._state         = this.states.init;
    }

    get stepIdx()       { return this._stepIdx; }
    get state()         { return this._state; }
    get result()        { return this._result; }
    get response()      { return this._response; }

    start()         {
        this._state     = this.states.start;
        this.send();
    }

    set response(resp)  {
        this._state     = this.states.response;
        this._response  = resp;
        this.send();
    }

    success(r) {
        this._state     = this.states.success;
        this._result    = r;
        this.send();
    }

    fail(f) {
        this._state     = this.states.failed;
        this._result    = f;
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
    constructor(step, fromIdx, toIdx) {
        super();

        this.name = 'RepeatMessage';

        this._repeat = {
            'step'   : step,
            'fromIdx': fromIdx,
            'toIdx'  : toIdx,
        };

        this.states = {
            'init'      : -1,
            'repeating' : 0,
            'done'      : 1
        };

        this._state = this.states.init;

        this._repeatByCount = {
            remaining   : null,
            total       : null,
        };

        this._repeatByTime = {
            until           : null,
            timesRepeated   : null
        };

        this._repeatType = this.repeatTypes.count;
        this._repeatTypes = {
            count   : 0,
            time    : 1
        };
    }

    get repeat()        { return this._repeat; }
    get getRepeatCount()   { return this._repeatByCount; }
    get repeatTime()    { return this._repeatByTime; }

    repeatCount(remaining, total) {
        this._repeatType                    = this.repeatTypes.count;
        this._state                         = this.states.repeating;

        this._repeatByCount.remaining       = remaining;
        this._repeatByCount.total           = total;
        this.send();
    }

    timedRepeat(until, times) {
        this._repeatType                    = this.repeatTypes.time;
        this._state                         = this.states.repeating;

        this._repeatByTime.until            = until;
        this._repeatByTime.timesRepeated    = times;
        this.send();
    }

    done() {
        this._state                         = this.states.done;
        this.send();
    }
}
