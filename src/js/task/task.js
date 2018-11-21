/*
 * WPETestFramework task runner
 *
 * Copyright (c) 2018 Metrological.com
 *
 */
/*jslint esnext: true*/

const DEFAULT_TIMEOUT = 5 * 60 * 1000;
const DEFAULT_TASK_TIMEOUT = 60 * 60 * 1000;

var verbose = false;
var window = this;

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

/******************************************************************************/
/*****************************       INIT        ******************************/
/******************************************************************************/

var curIdx              = -1;
var maxSteps, steps;
var timer;
var taskTimer;
var timedOut            = false;
var processEndRequested = false;
var stepMessage;
var stepList;
var repeatMessage;
let bootStep            = 0;
var testId;
this.test = test = undefined;

console.log('Beep boop, task.js loaded');

// Parent process messages
addEventListener('message', function(message) {
    if (message.data.name === undefined)
        return;

    if (message.data.name === 'InitReady' && message.data.test !== '') {
        initTest(message.data.test);
    }
}, false);

var bootSequence = {
    'loadScript' : function(cb) {
        // dependencies
        importScripts('../lib/moment.min.js');
        importScripts('../plugins/base.js');
        importScripts('../plugins/framework.js');
        importScripts('../core/messages.js');

        // setup our base messages
        testMessage = new TestMessage();
        _initReady = new InitReady();

        cb();
    },

    'loadPlugins' : function(cb) {
            console.debug('Load base & framework plugin');

            // we're loading in debug, retry in a few ms it takes a bit to load the seperate plugins
            if (window.plugins == undefined || window.plugins.Framework === undefined || window.plugins.Base === undefined) {
                cb(null, 2000);
                return;
            }

            let plugins = new window.plugins.Framework();

            // this is required because non of the functions in the tests are pre-fixed, so all has to be global
            mergeObjects(window, plugins);

            cb();
    },

    'initReady' : function(cb) {
        _initReady.send();
    }
}

function init() {
    var initFunctionList = Object.keys(bootSequence);

    // check if we are done
    if (bootStep > initFunctionList.length-1)
        return;

    // else start the boot function
    bootSequence[ initFunctionList[ bootStep ] ]( (delayInMs, retryInMs) => {
        if (delayInMs === null && retryInMs !== undefined) {
            console.debug(`Retrying bootstep ${bootStep} in ${delayInMs} ms`);
            setTimeout(init, retryInMs);
        }

        else if (delayInMs !== undefined) {
            console.debug(`Bootstep ${bootStep} completed, starting next in ${delayInMs} ms`);
            bootStep++;
            setTimeout(init, delayInMs);
        }

        else {
            console.debug(`Bootstep ${bootStep} completed, starting next`);
            bootStep++;
            init();
        }

    });
}

// global function to call when test is not applicable
var testIsNA = false;
var NotApplicable = function (reason) {
    testIsNA = true;
    testMessage.notApplicable(reason);
}


function initTest(testName) {
    // Load test
    try {
        importScripts('../tests/' + testName + '.js');
    } catch (e) {
        if (testIsNA !== true) {
            process_end('Error, could not load test ' + e);
        }

        return;
    }

    if (test && test.extends !== undefined){
        try {
            var extendTest = test;
            importScripts('../tests/' + test.extends + '.js');
            mergeObjects(extendTest.steps, test.steps);
            test = extendTest;
        } catch (e) {
            process_end('Could not load test to extend, test file not found');
        }
    }

    if (test && test.requiredPlugins !== undefined && test.requiredPlugins.length > 0) {
        getPlugins(null, (response) => {
            try {
                var responseObj = JSON.parse(response.body);
                var plugins = responseObj.plugins;
                var enabledPlugins = [];
                for (var i=0; i<plugins.length; i++) {
                    enabledPlugins.push(plugins[i].callsign);
                }

                for (var j=0; j<test.requiredPlugins.length; j++) {
                    if (enabledPlugins.indexOf(test.requiredPlugins[j]) === -1) {
                        NotApplicable(`Build does not support ${test.requiredPlugins[j]}`);
                    } else if (j === test.requiredPlugins.length-1) {
                        startTest();
                    }
                }
            } catch(e) {
                process_end('Failed to retrieve plugins from Framework while checking requiredPlugins');
            }
        });
    } else {
        startTest();
    }
}

/******************************************************************************/
/*****************************    test hander    ******************************/
/******************************************************************************/

function startTest() {
    // make sure we dont start this if the task during load is NA'ed
    if (testIsNA === true) return;

    stepList = Object.keys(test.steps);
    maxSteps = stepList.length;

    testMessage.setStepCount(maxSteps-1);
    testMessage.start();

    // set timer for the entire task, can be overwritten
    taskTimer = setTimeout(timedout, test.timeout !== undefined ? test.timeout * 1000 : DEFAULT_TASK_TIMEOUT);

    lookForNextStep();
}

function timedout() {
    testMessage.timedout();
    checkAndCleanup( () => {
        testMessage.complete();
        setTimeout(close, 1000);
    });
}

function checkAndCleanup(cb) {
    if (test.cleanup !== undefined) {
        test.cleanup( (result) => {
            testMessage.cleanedup(result);
            testMessage.complete();

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
        testMessage.error(error);

    // check if test has a cleanup function defined, run it if we encountered an error
    if (error !== undefined) {
        checkAndCleanup( () => {
            testMessage.complete();
            setTimeout(close, 1000);
        });
    } else {
        testMessage.complete();
        setTimeout(close, 1000);
    }
}

function lookForNextStep() {
    //reset timers
    clearTimeout(timer);

    var nextIdx = curIdx+1;
    if (nextIdx >= maxSteps) {
        // we've made it!
        testMessage.success();
        process_end();
        return;
    }

    var nextStep = test.steps[ stepList[ nextIdx ] ];

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
    this.currentStep = test.steps[ stepList[ curIdx ] ];
    this.previousStep = undefined;
    if (curIdx > 0) this.previousStep = test.steps[ stepList[ curIdx-1 ] ];

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
        test.steps[ stepList [ curIdx ] ].response = response;

        stepMessage.setResponse(response);
        validateStep(curIdx, response);
    }

    setTimeout(execFnWrapper, sleepMs);
}


/**
 * Validate the results of the executed test function
 */
function validateStep(stepIdx, response) {
    var isSuccess = false, msg;
    var currentStep = test.steps[ stepList[ stepIdx ] ];
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
    var currentStep = test.steps[ stepList[ curIdx ] ];

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


//start init
init();

