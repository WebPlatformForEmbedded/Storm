/*
 * WPETestFramework task runner
 *
 * Copyright (c) 2018 Metrological.com
 *
 */
/*jslint esnext: true*/

var verbose = false;
var debug   = false;
var window  = this;

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

// messaging
var _test;
var _step;
var _repeatStep;

this.test = test = undefined;

console.log('Beep boop, task.js loaded');

// Parent process messages
addEventListener('message', function(message) {
    let data = message.data;

    if (data.messageContext === undefined)
        return;

    if (data.messageContext === 'Init' && data.state === 1) {
            debug = data.debug;

        init();
    }

    if (data.messageContext === 'Init' && data.state === 3 && data.test !== '') {
        this.host = message.data.host;
        initTest(message.data.test);
    }

    // returned image data from main thread
    if (data.messageContext === 'NeedImage' && data.imageData !== '' && this.fetchImageDataCallback !== undefined)
        this.fetchImageDataCallback(data.imageData);

}, false);

var bootSequence = {
    'loadScript' : function(cb) {


        importScripts('../lib/moment.min.js');

        // if debug load seperate files, else load minified plugins.js
        if (debug === true) {
            // dependencies
            importScripts('../plugins/base.js');
            importScripts('../plugins/framework.js');
            importScripts('../data/messages.js');
            importScripts('../data/test.js');
        } else {
            importScripts('../plugins.js');
            importScripts('../data.js');
        }

        // setup our base messages
        needImage   = new NeedImage();
        m_init      = new Init();

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
        m_init.setInitReady();
    }
}

function loaded() {
    // fake preinit message, since we dont know if we're going to be in debug or not
    postMessage({ messageContext: 'Init', state: 0 });
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
    if (_test !== undefined)
        _test.notApplicable(reason);
    else
        setTimeout(NotApplicable, 1000, reason);
}

// global function to fetch image data across web worker and main thread
var fetchImageData = function (url, cb) {
    this.fetchImageDataCallback = cb;
    needImage.setURL(url);
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

    // Basically keep 2 sets, 1 the test as read from the server.
    // 2 the data model test where we communicate back to the main thread.
    _test = new Test(test);
    _test.name = testName;

    if (_test && _test.requiredPlugins !== undefined && _test.requiredPlugins.length > 0) {
        getPlugins(null, (response) => {
            try {
                var responseObj = JSON.parse(response.body);
                var plugins = responseObj.plugins;
                var enabledPlugins = [];
                for (var i=0; i<plugins.length; i++) {
                    enabledPlugins.push(plugins[i].callsign);
                }

                for (var j=0; j<_test.requiredPlugins.length; j++) {
                    if (enabledPlugins.indexOf(_test.requiredPlugins[j]) === -1) {
                        NotApplicable(`Build does not support ${_test.requiredPlugins[j]}`);
                    } else if (j === _test.requiredPlugins.length-1) {
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

let bootStep            = 0;
var curIdx              = -1;
var maxSteps, steps;
var processEndRequested = false;
var stepList;
var testId;
var timer;
var taskTimer;
var timedOut            = false;

function startTest() {
    // make sure we dont start this if the task during load is NA'ed
    if (testIsNA === true) return;

    stepList = Object.keys(test.steps);
    maxSteps = stepList.length;

    _test.start();
    taskTimer = setTimeout(timedout, (_test.timeout * 1000) );

    lookForNextStep();
}

function timedout() {
    _test.timedout();
    checkAndCleanup( () => {
        _test.complete();
        setTimeout(close, 1000);
    });
}

function checkAndCleanup(cb) {
    if (_test.cleanup !== undefined) {
        _test.cleanup( (result) => {
            _test.cleanedup(result);
            _test.complete();

            s(cb, 1000);
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
        _test.error(error);

    // check if test has a cleanup function defined, run it if we encountered an error
    if (error !== undefined) {
        checkAndCleanup( () => {
            _test.complete();
            setTimeout(close, 1000);
        });
    } else {
        _test.complete();
        setTimeout(close, 1000);
    }
}

function lookForNextStep() {
    //reset timers
    clearTimeout(timer);

    var nextIdx = curIdx+1;
    if (nextIdx >= maxSteps) {
        // we've made it!
        _test.success();
        process_end();
        return;
    }

    var nextStep = _test.steps[ stepList[ nextIdx ] ];

    // GOTO Repeat handling
    if (nextStep.goto !== undefined){
        // look up goto step in the list
        var gotoStep = stepList.indexOf(nextStep.goto);

        // count based repeat
        if (nextStep.repeat){
            if (nextStep.repeatTotal === undefined) {
                // first time, set repeat values
                _test.setRepeat(true);
                nextStep.repeatTotal = nextStep.repeat;

                _repeatStep = new Step(nextStep, nextIdx, stepList[ nextIdx ], _test.name);
                _repeatStep.start();
            }

            _test.setRepeatRemainging({ repeatTotal: nextStep.repeatTotal, repeatRemainingCount: nextStep.repeat });
            nextStep.repeat -= 1;

            // were done
            if (nextStep.repeat <= 0) {
                _test.setRepeat(false);
                _repeatStep.success();
                curIdx+=1;
                lookForNextStep();
            } else {
                startStep(gotoStep);
            }
        // time based repeat
        } else if (nextStep.repeatTime){
            if (nextStep.repeatTimeStamp === undefined){
                //first time, set timestamp
                nextStep.repeatTimeStamp = moment().add(nextStep.repeatTime, 'minutes').format();
                nextStep.repeatTimes = 0;

                //new
                _test.setRepeat(true);
                _test.setRepeatRemainging({ repeatRemainingTime: nextStep.repeatTimeStamp });

                _repeatStep = new Step(nextStep, nextIdx, stepList[ nextIdx ], _test.name);
                _repeatStep.start();
            }

            nextStep.repeatTimes++;

            if (moment().isAfter(nextStep.repeatTimeStamp)){
                _test.setRepeat(false);
                _repeatStep.success();

                curIdx+=1;
                lookForNextStep();
            } else {
                startStep(gotoStep);
            }
        }

    } else if (nextStep.user !== undefined){
        askUser(curIdx+1);
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
    this.currentStep = _test.steps[ stepList[ curIdx ] ];
    this.previousStep = undefined;
    if (curIdx > 0) this.previousStep = test.steps[ stepList[ curIdx-1 ] ];

    if (_step !== undefined)
        delete _step;

    _step = new Step(this.currentStep, curIdx, stepList[ curIdx ], _test.name);
    _test.steps[ stepList[ curIdx ] ] = _step;
    _step.start();

    timedOut = false;

    // set timeout
    timer = setTimeout(timedout, _step.timeout * 1000, curIdx);

    // sleep
    var sleepMs = this.currentStep.sleep !== undefined ? this.currentStep.sleep * 1000 : 1000;
    // execution
    var execFn = this.currentStep.test !== undefined ? this.currentStep.test : dummy;
    if (this.currentStep.params === undefined) this.currentStep.params = handleResponse;

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
        _step.setResponse(response);
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
        _step.success(msg);
        lookForNextStep();
    } else {
        _step.fail(msg);
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

    _step = new Step(currentStep, curIdx);
    _step.start();
    _step.needUser();

    // set timeout
    timer = setTimeout(timedout, _step.timeout * 1000, curIdx);
}

function userResponse(message){
    if (message.state() !== message.states.success) {
        _step.fail(message.response);
        process_end(message.response);
    } else {
        _step.success(message.response);
        lookForNextStep();
    }
}

// Test utility
getResponseByStep = function(step) {
    return _test.steps[ step ].getResponse();
}

//start init
loaded();
