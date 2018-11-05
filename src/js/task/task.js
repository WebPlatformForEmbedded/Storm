/*
 * WPETestFramework task runner
 *
 * Copyright (c) 2017 Metrological.com
 *
 */
/*jslint esnext: true*/

const DEFAULT_TIMEOUT = 5 * 60 * 1000;

var verbose = false;
var taskId;

// load framework
function mergeObjects(a, b){
    for (var attrname in b) {
        //console.log('Merging: ' + attrname);
        a[attrname] = b[attrname];
    }
}

function globalize(file){
    // import tests and validations
    var o = require(file);
    mergeObjects(global, o);
}

// dependencies
importScripts('../lib/moment.min.js');

// load message bus
importScripts('../core/messages.js');

// setup our base messages
var _initReady = new InitReady();
var taskMessage = new TaskMessage();

/*
globalize('./base.js');
globalize('./dial.js');
globalize('./framework.js');
globalize('./remoteinspector.js');
globalize('./ssh.js');
globalize('./webdriver.js');
*/
this.task = task = undefined;

/******************************************************************************/
/*****************************       INIT        ******************************/
/******************************************************************************/

var curIdx = -1;
var maxSteps, steps;
var timer;
var timedOut = false;
var processEndRequested = false;
var stepMessage;
var stepList;
var repeatMessage;

// Parent process messages
onmessage = (message) => {
    if (message.type() === 'stepMessage' && message.state() === 'response'){
        userResponse(message);
    }

    if (message.type() === 'loadTest') {
        initTest(message.testName());
    }
};

// global function to call when test is not applicable
var taskIsNA = false;
var NotApplicable = function (reason) {
    taskIsNA = true;
    taskMessage.notApplicable(reason);
}

function initTest(testName) {
    // Load test
    try {
        task = importScripts('js/tests/' + testName)
    } catch (e) {
        if (taskIsNA !== true) {
            process_end('Error, could not load test ' + e);
        }
    }

    if (task && task.extends !== undefined){
        try {
            var parentTest = importScripts('js/tests/' + testName);
            var extendSteps = task.steps;
            task.steps = parentTest.steps;
            mergeObjects(task.steps, extendSteps);
        } catch (e) {
            process_end('Could not load test to extend, task file not found');
        }
    }

    if (task.requiredPlugins !== undefined && task.requiredPlugins.length > 0) {
        getPlugins(null, (response) => {
            try {
                var responseObj = JSON.parse(response.body);
                var plugins = responseObj.plugins;
                var enabledPlugins = [];
                for (var i=0; i<plugins.length; i++) {
                    enabledPlugins.push(plugins[i].callsign);
                }

                for (var j=0; j<task.requiredPlugins.length; j++) {
                    if (enabledPlugins.indexOf(task.requiredPlugins[j]) === -1) {
                        NotApplicable(`Build does not support ${task.requiredPlugins[j]}`);
                    } else if (j === task.requiredPlugins.length-1) {
                        startTask();
                    }
                }
            } catch(e) {
                process_end('Failed to retrieve plugins from Framework while checking requiredPlugins');
            }
        });
    } else {
        startTask();
    }
}

/******************************************************************************/
/*****************************    TASK hander    ******************************/
/******************************************************************************/

function startTask() {
    // make sure we dont start this if the task during load is NA'ed
    if (taskIsNA === true) return;

    stepList = Object.keys(task.steps);
    maxSteps = stepList.length;

    taskMessage.stepCount(maxSteps-1);
    taskMessage.start();

    lookForNextStep();
}

function timedout(step) {
    taskMessage.timedout();
    checkAndCleanup( () => {
        taskMessage.completed();
        setTimeout(close, 1000);
    });
}

function checkAndCleanup(cb) {
    if (task.cleanup !== undefined) {
        task.cleanup( (result) => {
            taskMessage.cleanup(result);
            taskMessage.completed();

            setTimeout(cb, 1000);
        });
    } else {
        cb();
    }
}

function process_end(error) {
    // fail safe
    if (processEndRequested === true)
        close(1);
    processEndRequested = true;

    // clear the timeout, since we are exiting
    clearTimeout(timer);

    if (error !== undefined)
        taskMessage.error(error);

    // check if task has a cleanup function defined, run it if we encountered an error
    if (error !== undefined) {
        checkAndCleanup( () => {
            taskMessage.completed();
            setTimeout(close, 1000);
        });        
    } else {
        taskMessage.completed();
        setTimeout(close, 1000);
    }
}

function lookForNextStep() {
    clearTimeout(timer);

    var nextIdx = curIdx+1;
    if (nextIdx >= maxSteps) {
        // we've made it!
        taskMessage.success();
        process_end();
        return;
    }

    var nextStep = task.steps[ stepList[ nextIdx ] ];

    // GOTO Repeat handling
    if (nextStep.goto !== undefined){

        repeatMessage = new RepeatMessage(nextIdx, nextIdx, gotoStep);

        // look up goto step in the list
        var gotoStep = stepList.indexOf(nextStep.goto);

        // count based repeat
        if (nextStep.repeat){
            if (nextStep.repeatTotal === undefined)
                nextStep.repeatTotal = nextStep.repeat;

            repeatMessage.repeatCount(nextStep.repeat, nextStep.repeatTotal);
            nextStep.repeat -= 1;

            // were done
            if (nextStep.repeat <= 0) {
                repeatMessage.done();
                curIdx+=1;
                lookForNextStep();
            } else {
                startStep(gotoStep);
            }
        // time based repeat
        } else if (nextStep.repeatTime){
            if (nextStep.repeatTimeStamp === undefined){
                //first time, set timestamp
                nextStep.repeatTimeStamp = moment().add(nextStep.repeatTime, 'minutes');
                nextStep.repeatTimes = 0;
            }

            nextStep.repeatTimes++;

            if (moment().isAfter(nextStep.repeatTimeStamp)){
                repeatMessage.done();
                curIdx+=1;
                lookForNextStep();
            } else {
                repeatMessage.timedRepeat(nextStep.repeatTimeStamp, nextStep.repeatTimes);
                startStep(gotoStep);
            }
        }
    // Handle user input steps
    } else if (nextStep.user !== undefined){
        askUser(curIdx+1);
    // default execution
    } else {
        startStep(curIdx+1);
    }
}

/**
 * Starts the test function that is part of the test step definition, including timeout handling and calling the validate function
 */
function startStep(stepIdx) {
    // init
    curIdx = stepIdx;
    this.currentStep = task.steps[ stepList[ curIdx ] ];
    this.previousStep = undefined;
    if (curIdx > 0) this.previousStep = task.steps[ stepList[ curIdx-1 ] ];

    if (stepMessage !== undefined)
        delete stepMessage;

    stepMessage = new StepMessage(curIdx);
    stepMessage.start();

    timedOut = false;

    // set timeout
    var _tm = this.currentStep.timeout !== undefined ? this.currentStep.timeout * 1000 : DEFAULT_TIMEOUT;
    timer = setTimeout(timedout, _tm, curIdx);

    // sleep
    var sleepMs = this.currentStep.sleep !== undefined ? this.currentStep.sleep * 1000 : 1000;
    // execution
    var execFn = this.currentStep.test !== undefined ? this.currentStep.test : dummy;

    // wrap the function in a try/catch block
    function execFnWrapper (params) {
        try {
            execFn(currentStep.params, handleResponse);
        } catch(e) {
            process_end(`Error executing step ${stepIdx}: ${e}`);
        }
    }

    function handleResponse (response) {
        // results
        task.steps[ stepList [ curIdx ] ].response = response;

        stepMessage.response(response);
        validateStep(curIdx, response);
    }

    if (this.currentStep.params === undefined) this.currentStep.params = handleResponse;
    setTimeout(execFnWrapper, sleepMs);
}


/**
 * Validate the results of the executed test function
 */
function validateStep(stepIdx, response) {
    var isSuccess = false, msg;
    var currentStep = task.steps[ stepList[ stepIdx ] ];
    var expect = currentStep.expect;

    // asssert
    if (currentStep.assert !== undefined){
        if (currentStep.assert == response) {
            isSuccess = true;
        } else {
            msg = `Step ${stepIdx}: expected ${currentStep.assert} while result was ${response}`;
        }
    // validate inline
    } else if (currentStep.validate !== undefined && !currentStep.validate instanceof Function){
        // its not a function, we should use assert but what the hell
        if (currentStep.validate == response) {
            isSuccess = true;
        } else {
            msg = `Step ${stepIdx}: expected ${currentStep.assert} while result was ${response}`;
        }
    } else if (currentStep.validate !== undefined && currentStep.validate instanceof Function){
        var validateFn = currentStep.validate;
        try {
            isSuccess = validateFn(response);
        } catch (e) {
            msg = `Error executing validate on step ${stepIdx}: ${e}`;
        }
    // OK if none of the above
    } else {
        // auto approve step, nothing to validate
        isSuccess = true;
    }


    if (isSuccess === true) {
        stepMessage.success(msg);
        lookForNextStep();
    } else {
        stepMessage.fail(msg);
        process_end(msg);
    }
}

/**
 * Ask the user for confirmation for manual tests
 */
function askUser(stepIdx) {
    // init
    curIdx = stepIdx;
    var currentStep = task.steps[ stepList[ curIdx ] ];

    stepMessage = new StepMessage(curIdx);
    stepMessage.start();

    stepMessage.needUser();

    // set timeout
    var _tm = currentStep.timeout !== undefined ? currentStep.timeout * 1000 : DEFAULT_TIMEOUT;
    timer = setTimeout(timedout, _tm, curIdx);

}

function userResponse(message){
    if (message.state() !== message.states.success) {
        process_end(message.response());
    } else {
        lookForNextStep();
    }
}

// tell parent process we're ready to roll
_initReady.send();
