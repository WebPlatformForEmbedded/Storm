
/*
 * This is the main Test message object, it covers the entire task that needs to be executed (i.e. TEST that needs to be run) from start to finish
 * Extend message so we can send it back and forth to the worker
 */

class Test extends Message {
    constructor(jsonData) {
        super();

        // from manifest
        this.description = jsonData.description;
        this.disabled = (jsonData.disabled == 'true');
        this.file = jsonData.file;
        this.name = jsonData.name
        this.operator = jsonData.operator;
        this.title = jsonData.title;

        // from file
        this.cleanup = jsonData.cleanup;
        this.extends = jsonData.extends;
        this.requiredPlugins = jsonData.requiredPlugins ? jsonData.requiredPlugins : [];
        this.timeout = jsonData.timeout ? jsonData.timeout : 60 * 60;
        this.steps = jsonData.steps ? jsonData.steps : {};

        // known keys are needed to be able to add unknowns keys to the parent object. See parseDataFromFile fn
        this.knownKeys = ['operator', 'title', 'description', 'requiredPlugins', 'timeout', 'cleanup', 'steps'];

        // internal data
        this.messageContext = 'TestMessage';
        this.loaded = false;

        this.result = '';
        this.cleanedup = false;
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

        // these are the states to be synced between worker and main thread
        this.statesToBeSynced = ['name', 'state', 'result', 'cleanedup', 'cleanupResult', 'completed'];
    }

    // Loads the test from the server and adds it in our data model
    load(cb) {
        get(this.file, (resp) => {
            if (resp.error) {
                cb(resp);
                return;
            }

            let test;
            try {
                // jshint, rightfully so, warns about eval being evil. We're using it conciously.
                /* jshint ignore:start */
                test = eval(resp.body);
                /* jshint ignore:end */
            } catch(e) {
                cb({ 'error' : e.message });
                return;
            }

            this.cleanup = test.cleanup;
            this.disabled = test.disabled ? test.disabled : 'false';
            this.extends = test.extends;
            this.requiredPlugins = test.requiredPlugins ? test.requiredPlugins : [];
            this.timeout = test.timeout ? test.timeout : 60 * 60 * 1000;
            this.title = test.title;

            this.currentStep;

            //store custom fields, these are often used in tests for utility
            let objectsInTest = Object.keys(test);
            for (let i=0; i<objectsInTest.length; i++) {
                let objectName = objectsInTest[i];

                if (this.knownKeys.indexOf(objectName) !== -1)
                    continue;

                // add it to this
                this[ objectName ] = test[ objectsInTest[i] ];
            }

            // if the test extends another, load that one too and merge the two
            if (this.extends !== undefined) {
                _getExtendedTestSteps(this.extends, (_resp) => {
                    if (_resp.error)
                        cb(_resp);

                    if (_resp.steps) {
                        // merge tests
                        for (var attrname in _resp.test.steps)
                            test.steps[attrname] = _resp.steps[attrname];
                    }

                    this._addSteps(test.steps, cb);
                });
            } else {
                this._addSteps(test.steps, cb);
            }
        });
    }

    _getExtendedTestSteps(ex, cb) {
        get('js/tests/' + ex + '.js', (_resp) => {
            if (_resp.error) {
                cb({ error : 'Error loading extended test' + test.extends})
            }

            let test;
            try {
                // jshint, rightfully so, warns about eval being evil. We're using it conciously.
                /* jshint ignore:start */
                test = eval(_resp.body);
                /* jshint ignore:end */
            } catch(e) {
                cb({ 'error' : e.message });
                return;
            }

            cb({ steps : test.steps });
        });
    }

    _addSteps(steps, cb) {
        let stepList = Object.keys(steps);
        for (let j=0; j<stepList.length; j++) {
            this.steps[ stepList[j] ] = new Step(steps[ stepList[j] ], j);

            if (j >= stepList.length-1)
                cb({ test: this });
        }

        // I guess were loaded...
        this.loaded = true;
    }

    /*
     * GETTERS for the UI
     */
    getState() {
        let response;
        switch (this.state) {
            case this.states.init:
                response = 'Not Started';
                break;

            case this.states.start:
                response = 'Running';
                break;

            case this.states.timedout:
                response = 'Timed out';
                break;

            case this.states.error:
                response =  'Error';
                break;

            case this.states.success:
                response = 'Success';
                break;

            case this.states.notapplicable:
                response = 'Not Applicable';
                break;
        }

        return response;
    }

    getPercCompleted() {
        let response = '0';
        if (this.state > 1 || this.currentStep !== undefined) {
            // find current step
            let stepList = Object.keys(this.steps);
            let currentStepIdx = stepList.indexOf(this.currentStep);
            response = ( ((currentStepIdx+1) / stepList.length) * 100).toFixed(0);
        }
        return response;
    }

    getResult() {
        return this.result;
    }

    getError() {
        let response = '';
        if (this.state === this.states.error || this.state === this.states.timedout || this.state === this.states.notapplicable)
            response = this.result;

        return response;
    }

    /*
     * Worker related updates
     */
    start() {
        this.state = this.states.start;
        this.sync();
    }

    error(e)    {
        this.state = this.states.error;
        this.result = e;
        this.sync();
    }

    timedout(e) {
        this.state = this.states.timedout;
        this.result = e;
        this.sync();
    }

    success(e) {
        this.state = this.states.success;
        this.result = e;
        this.sync();
    }

    notApplicable(e) {
        this.state = this.states.notapplicable;
        this.result = e;
        this.sync();
    }

    complete(e) {
        this.completed = true;
        this.sync();
    }

    cleanedup(e) {
        this.cleanedup = true;
        this.cleanupResult = e;
        this.sync();
    }
}


/*
 * For every step executed there is a step message that controls the flow of start->fail or success.
 * System or user responses are capturedin the response field to debug issues later on in time when the test is completed
 */
class Step extends Message {
    constructor(step, stepIdx, stepName, testName) {
        super();

        this.assert = step.assert;
        this.description = step.description;
        this.params = step.params;
        this.sleep = step.sleep;
        this.test = step.test;
        this.timeout = step.timeout ? step.timeout : 5 * 60 * 1000;
        this.validate = step.validate;


        // internal
        this.messageContext = 'StepMessage';
        this.name           = stepName;
        this.testName       = testName;
        this.stepIdx        = stepIdx;
        this.response       = null;
        this.result         = null;

        this.states = {
            'init'      : -1,
            'start'     : 0,
            'response'  : 1,
            'success'   : 2,
            'failed'    : 3,
            'needuser'  : 4
        };

        this.state         = this.states.init;
        this.statesToBeSynced = ['name', 'stepIdx', 'response', 'result', 'state', 'testName'];
    }

    getState() {
        let response = 'Not Started';

        if (this.state === this.states.init)
            response = 'Not Started';
        else if (this.state === this.states.start)
            response = 'Running';
        //else if (this.state === this.states.response)
            //response = 'Response';
        else if (this.state === this.states.success)
            response = 'Success';
        else if (this.state === this.states.failed)
            response = 'Failed';

        return response;
    }

    start()         {
        this.state     = this.states.start;
        this.sync();
    }

    setResponse(resp)  {
        this.state     = this.states.response;
        this.response  = resp;
        this.sync();
    }

    getResponse() {     return this.response; }

    success(r) {
        this.state     = this.states.success;
        this.result    = r;
        this.sync();
    }

    fail(f) {
        this.state     = this.states.failed;
        this.result    = f;
        this.sync();
    }

    needUser() {
        this.state     = this.states.needuser;
        this.sync();
    }
}