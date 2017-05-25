/*
 * WPETestFramework task runner
 *
 * Copyright (c) 2017 Metrological.com
 *
 */
/*jslint esnext: true*/
/*jslint node: true*/

const DEFAULT_TIMEOUT = 5 * 60 * 1000;

const moment = require('moment');
const assert = require('assert');
const readline = require('readline');

var git = false;
var verbose = false;
var taskId;

if (!process.connected)
    console.warn('Warning! You are running the task runner directly without the WPETestFramework agent, this is experimental and mileage may vary.');

// make sure we stop the task if the agent stops/dies
process.on('disconnect', function() {
  process.exit();
});

function log(event, message, cb){
    if (cb === undefined && typeof message === 'function') { cb = message; message = undefined; }
    var msg = message !== undefined ? message : '';

    if (msg instanceof Object) msg = JSON.stringify(msg);
    if (verbose === true && !process.connected) console.log(`${event} \t ${JSON.stringify(msg)}`);

    // bubble up message to parent process
    if (process.connected === true) {
        process.send({ 'event' : event,  'msg' : message }, cb);
    } else {
        if(typeof cb === 'function') cb();
    }
}

// process arguments
var helpmsg = 'WPETestFramework Task Runner - 2017 (c) Metrological\n';
helpmsg += ' usage: node task.js (options)\n\n';
helpmsg += ' options: \n';
helpmsg += ' -h, --help             this help  message\n';
helpmsg += ' -t <test>              execute test <test>\n';
helpmsg += ' -v                     enable verbose logging to console.log (only use when running directly)\n';
helpmsg += ' --host                 set the IP of the host\n';
helpmsg += ' --serverip             set the IP of the server\n';
helpmsg += ' --devicetype           set the type of device (must match targets.js)\n';
helpmsg += ' --skipcopy             skip copy of zImage/rootfs to nfs/tftp directories for installer\n';
helpmsg += '\n NOTE: This task runner is not meant to be run standalone and should be executed as a child process from WPETestFramework core\n';
helpmsg += "That said, if you know what you're doing, enjoy!\n";

var argv = require('minimist')(process.argv.slice(2));
log('task_init');

if (( argv.h !== undefined || argv.help !== undefined) || (argv.t === undefined)) { console.log(helpmsg); process.exit(); }

if (argv.v !== undefined) verbose=true;
if (argv.host !== undefined) host = argv.host;
if (argv.server !== undefined) server = argv.server;
if (argv.skipcopy !== undefined) skipCopy=true;

var test = argv.t !== undefined ? argv.t : null;

const devices = require('./targets.js').devices;
this.devicetype = devicetype = argv.devicetype;

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

globalize('./base.js');
globalize('./framework.js');
globalize('./ssh.js');
globalize('./dial.js');
globalize('./webdriver.js');
this.task = task = undefined;

// machine specific
if (devicetype === 'horizon') {
    globalize('./horizon.js');
    globalize('./telnet.js');
}

// global function to call when test is not applicable
var taskIsNA = false;
global.NotApplicable = function (reason) {
    taskIsNA = true;
    log('task_notapplicable', reason, () => {
        process_end();
    });
}

try {
    task = require('../tests/' + test + '.js');
} catch (e) {
    if (taskIsNA !== true) {
        log('task_error', '' + e, () => {
            process.exit(1);
        });
    }
}

if (task === undefined || task.steps === undefined) { process_end(1); return; }

/******************************************************************************/
/*****************************       INIT        ******************************/
/******************************************************************************/

var curIdx = -1;
var maxSteps, steps;
var timer;
var timedOut = false;
var processEndRequested = false;

// Parent process messages
if (process.connected === true){
    process.on('message', (message) => {
        if (message.type === 'step_user_response'){
            var body = message.body;
            userResponse(body.step, body.result, body.response);
        }

    });
}

if (task && task.extends !== undefined){
    try {
        var parentTest = require(`../tests/${task.extends}`);
        var extendSteps = task.steps;
        task.steps = parentTest.steps;
        mergeObjects(task.steps, extendSteps);
    } catch (e) {
        log('task_error', 'Could not load task to extend, task file not found', () => {
            process.exit(1);
        });
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

/******************************************************************************/
/*****************************    TASK hander    ******************************/
/******************************************************************************/

function startTask() {
    // make sure we dont start this if the task during load is NA'ed
    if (taskIsNA === true) return;

    stepList = Object.keys(task.steps);
    maxSteps = stepList.length;

    log('step_count', maxSteps-1);
    log('task_start');

    lookForNextStep();
}

function timedout(step) {
    log('task_timedout', { 'step' : step } ,  () => {
        process_end('Task timed out');
    });
}

function process_end(error) {
    // fail safe
    if (processEndRequested === true)
        process.exit(1);
    processEndRequested = true;

    // clear the timeout, since we are exiting
    clearTimeout(timer);

    if (error !== undefined)
        log('task_error', '' + error);

    // check if task has a cleanup function defined, run it if we encountered an error
    if (error !== undefined && task && task.cleanup !== undefined) {
        log('task_cleanup');
        task.cleanup( (result) => {
            if (result !== undefined)
                log('task_cleanup_result', result);

            log('task_completed', () => {
                process.exit(1);
            });
        });
    } else {
        log('task_completed', () => {
            process.exit(error !== undefined ? 1 : 0);
        });
    }
}

/*
 * Because we can't catch all errors catch the uncaught and still try to do the cleanup from here. I know, dirty.
 */
process.on('uncaughtException', (e) => {
    var err = e.toString() + ' \n';
    err += e.stack;

    process_end('uncaughtException: ' + err);
});


function lookForNextStep() {
    clearTimeout(timer);

    var nextIdx = curIdx+1;
    if (nextIdx >= maxSteps) {
        // we've made it!
        log('task_success', () => {
            process_end();
        });
        return;
    }

    var nextStep = task.steps[ stepList[ nextIdx ] ];

    // GOTO Repeat handling
    if (nextStep.goto !== undefined){
        // look up goto step in the list
        var gotoStep = stepList.indexOf(nextStep.goto);

        var repeatObj = {
            'step'      : nextIdx,
            'fromIdx'   : nextIdx,
            'toIdx'     : gotoStep
        };

        // count based repeat
        if (nextStep.repeat){
            if (nextStep.repeatTotal === undefined)
                nextStep.repeatTotal = nextStep.repeat;

            repeatObj.repeatCount = nextStep.repeat;
            repeatObj.repeatTotal = nextStep.repeatTotal;
            nextStep.repeat -= 1;

            if (nextStep.repeat <= 0) {
                log('step_repeat_done');
                curIdx+=1;
                lookForNextStep();
            } else {
                log('step_repeat', repeatObj);
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
                log('step_repeat_done');
                curIdx+=1;
                lookForNextStep();
            } else {
                repeatObj.repeatUntil = nextStep.repeatTimeStamp;
                repeatObj.repeatTimes = nextStep.repeatTimes;
                log('step_repeat', repeatObj);
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

    log('step_start', { 'step': curIdx, 'description': this.currentStep.description });
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
    //execFn(currentStep.params, (response) => {
        // results
        task.steps[ stepList [ curIdx ] ].response = response;
        log('step_response', { 'step': curIdx, 'response' : response });
        validateStep(curIdx, response);
    }

    if (this.currentStep.params === undefined) this.currentStep.params = handleResponse;
    setTimeout(execFnWrapper, sleepMs);
}


/**
 * Validate the results of the executed test function
 */
function validateStep(stepIdx, response) {
    var result, msg;
    var currentStep = task.steps[ stepList[ stepIdx ] ];
    var expect = currentStep.expect;

    // asssert
    if (currentStep.assert !== undefined){
        if (currentStep.assert == response) {
            result=true;
        } else {
            msg = `Step ${stepIdx}: expected ${currentStep.assert} while result was ${response}`;
        }
    // validate inline
    } else if (currentStep.validate !== undefined && !currentStep.validate instanceof Function){
        // its not a function, we should use assert but what the hell
        if (currentStep.validate == response) {
            result=true;
        } else {
            msg = `Step ${stepIdx}: expected ${currentStep.assert} while result was ${response}`;
        }
    } else if (currentStep.validate !== undefined && currentStep.validate instanceof Function){
        var validateFn = currentStep.validate;
        try {
            result = validateFn(response);
        } catch (e) {
            msg = `Error executing validate on step ${stepIdx}: ${e}`;
        }
    // OK if none of the above
    } else {
        // auto approve step, nothing to validate
        result = true;
    }

    log('step_result', { 'step' : stepIdx, 'result' : result === true ? 'SUCCESS' : 'FAIL', 'msg' : msg } );

    if (result !== true) {
        process_end(msg);
    } else {
        lookForNextStep();
    }
}

/**
 * Ask the user for confirmation for manual tests
 */
function askUser(stepIdx) {
    // init
    curIdx = stepIdx;
    var currentStep = task.steps[ stepList[ curIdx ] ];
    log('step_start', { 'step': curIdx, 'description': currentStep.description });
    log('step_user_input', { 'step' : curIdx });

    // set timeout
    var _tm = currentStep.timeout !== undefined ? currentStep.timeout * 1000 : DEFAULT_TIMEOUT;
    timer = setTimeout(timedout, _tm, curIdx);

    // fake it if we are not connected
    if (!process.connected){
        //setTimeout(userResponse, 2 * 1000, 'FAIL');

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        var Q = '\n\   Please provide (S)uccess, (F)ail or (C)ancel: ';
        rl.question(currentStep.user + Q, (response) => {
            var res = false;
            if (response === 'S')
                res = true;

            validateStep(curIdx, res);
            rl.close();
        });
    }
}

function userResponse(step, result, messageFromUser){
    log('step_result', { 'step' : step, 'result' : result, 'msg' : messageFromUser } );
    if (result !== 'SUCCESS') {
        process_end(messageFromUser);
    } else {
        lookForNextStep();
    }
}