/*
 * WPETestFramework commandline stub for the agent
 *
 * Copyright (c) 2017 Metrological.com
 *
 */
/*jslint esnext: true*/
/*jslint node: true*/
'use strict';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
require('shelljs/global');

const moment = require('moment');
const fs = require('fs');
const deviceTargets = require('./targets.js').devices;
const Device = require('./device.js');
const config = require('./config.js');

/******************************************************************************/
/*****************************    CLIENT DATA    ******************************/
/******************************************************************************/

var agents = [];
var tasks = {};
var results = [];

class Agent {
    constructor(socket, sessionId) {
        this.sessionId = sessionId;
        this.socket = socket;
        this.discoveredDevices = [];
        this.activeDevices = {};
        this.activeTasks = [];
        this.deviceToBeActivated = undefined;
        this.tasks = {};
        this.steps = 0;
        this.ip = undefined;
        this.identification = undefined;

        // hooks
        this.socket.on('message', (message) => {
            if (message.type === undefined)
                return;

            var type = message.type;
            var body = message.body;
            var timestamp = message.timestamp;

            switch (type) {
                case 'whoami':
                    console.log(`Agent ${body} connected!`);
                    this.identification = body;
                    break;

                case 'discoveredDevices':
                    this.discoveredDevices = body;
                    menu_list_devices();
                    break;

                case 'active_devices':
                    this.activeDevices = body;
                    menu_list_active_devices();
                    break;

                case 'active_tasks':
                    this.activeTasks = body;
                    menu_list_active_tasks();
                    break;

                case 'device_deleted':
                    console.log(`Successfully deleted device ${body} from active devices`);
                    this.getActiveDevices();
                    break;

                case 'device_deleted':
                    console.log(`Successfully deleted device ${body} from active devices`);
                    this.getActiveDevices();
                    break;

                case 'deviceInfo_response':
                    this.parseDeviceInfo(body);
                    break;

                case 'device_added':
                    console.log('Device added successfully');
                    this.deviceToBeActivated = undefined;
                    this.getActiveDevices();
                    break;

                case 'deviceInfo_response_error':
                    this.handleDeviceInfoError(body);
                    break;

                default:
                    this.checkAndForwardToTask(type, body, timestamp);
            }
        });

        // initial stuff
        this.sendMessage('whoareyou');
        this.discover();
        this.getActiveDevices();

    }

    sendMessage(type, message) {
        var msg = {
            'type'      : type,
            'body'      : message,
            'timestamp' : moment().toISOString()
        };

        this.socket.emit('message', msg);
    }

    checkAndForwardToTask(event, m, timestamp) {
        if (m.id !== undefined && this.tasks[ m.id ] !== undefined) {
            this.tasks[ m.id ].updateStatus(event, m, timestamp);
        }
    }

    getActiveDevices() {
        this.sendMessage('active_devices');
    }

    getActiveTasks() {
        this.sendMessage('active_tasks');
    }

    discover() {
        // device
        this.sendMessage('discover');
    }

    activateDevice(device, type) {
        this.deviceToBeActivated = device;
        this.deviceToBeActivated.type = type;
        this.sendMessage('deviceInfo', device.hostname);
    }

    parseDeviceInfo (deviceInfo){
        if (deviceInfo.SystemInfo !== undefined && deviceInfo.systeminfo === undefined) {
            // stable Framework 
            this.deviceToBeActivated.id = deviceInfo.SystemInfo.SerialNumber;
            this.deviceToBeActivated.fwVersion = deviceInfo.SystemInfo.Version;
        } else if (deviceInfo.SystemInfo === undefined && deviceInfo.systeminfo !== undefined) {
            // master Framework 
            this.deviceToBeActivated.id = deviceInfo.systeminfo.serialnumber;
            this.deviceToBeActivated.fwVersion = deviceInfo.systeminfo.version;
        }

        console.log('Got device info response, using serialnumber: ' + this.deviceToBeActivated.id);
        console.log('Found firmware: ' + this.deviceToBeActivated.fwVersion);

        console.log('Activating device');
        this.sendMessage('activate_device', this.deviceToBeActivated);
    }

    handleDeviceInfoError (e) {
        console.error('Error adding device, did not response on deviceInfo request: ' + e.code);
        console.log('Adding without Framework  provided serial number, mocking it (is this a device without Framework ??). This is experimental and should be used with caution.');

        this.deviceToBeActivated.id = moment().valueOf();

        console.log('Activating device');
        this.sendMessage('activate_device', this.deviceToBeActivated);
    }

    deleteDevice (deviceId) {
        this.sendMessage('delete_device', deviceId);
    }

    run (deviceIdx, task, params) {
        var _device = this.activeDevices[ deviceIdx ];
        var taskId = moment().valueOf();
        var newTask = new Task(taskId, _device, task, params);

        console.log('starting task with: ' + newTask.task + ' for ' + _device.hostname);
        this.tasks[ taskId ] = newTask;
        this.sendMessage('new_task', newTask.getTaskDetails());
    }
}

class Task {
    constructor(id, device, task, params) {
        // status
        this.INIT               = 0;
        this.STARTED            = 1;
        this.COMPLETED          = 2;
        this.NOTAPPLICABLE      = 3;

        // results
        this.INPROGRESS         = 100;
        this.SUCCESS            = 101;

        this.FAILED             = 200;
        this.CANCELLED          = 201;
        this.TIMEDOUT           = 202;

        this.status             = this.INIT;
        this.result             = this.INIT;
        this.resultMessage      = undefined;

        // time info
        this.timeStarted        = undefined;
        this.timeCompleted      = undefined;
        this.duration           = 0;
        this.durationUnit       = 'm';
        this.durationString     = '';

        this.id                 = id;
        this.device             = device;
        this.deviceId           = device.id;
        this.task               = task;
        this.params             = params;

        this.stepLog            = [];

        this.stepCount          = 0;
        this.currentStep        = 0;
        this.currentResult      = undefined;
        this.currentResponse    = undefined;
        this.repeating          = false;
        this.repeatCount        = undefined;
        this.repeatUntil        = undefined;
        this.repeatFromIdx      = undefined;
        this.description        = undefined;
    }

    getResultString() {
        var resultString;

        if (this.result === this.INPROGRESS)
            resultString = 'In Progress';
        else if (this.result === this.SUCCESS)
            resultString = 'SUCCESS';
        else if (this.result === this.FAILED)
            resultString = 'FAILED';
        else if (this.result === this.CANCELLED)
            resultString = 'CANCELLED';
        else if (this.result === this.TIMEDOUT)
            resultString = 'TIMED OUT';
        else if (this.result === this.NOTAPPLICABLE)
            resultString = 'Not Applicable';
        else
            resultString = 'Not started';

        return resultString;
    }

    getDeviceDetails() {
        var re = {
            'id'            : this.deviceId,
            'type'          : this.device.type,
            'hostname'      : this.device.hostname,
            'fwVersion'     : this.device.fwVersion
        };
        return re;
    }

    getTaskDetails() {
        var re = {
            'id'            : this.id,
            'deviceId'      : this.deviceId,
            'task'          : this.task,
            'params'        : this.params,
        };
        return re;
    }

    updateStatus(event, m, timestamp) {
        //console.log(m);
        // parse duration
        if (this.timeStarted !== undefined) {
            var diff = moment(timestamp).diff(moment(this.timeStarted), 'minutes');

            // handle seconds if its a really small diff
            if (diff === 0) {
                diff = moment(timestamp).diff(moment(this.timeStarted), 'seconds');
                this.durationUnit = 's';
                this.duration = diff;
            } else {
                this.durationUnit = 'm';
                this.duration = diff;
            }

            this.durationString = '' + this.duration + this.durationUnit;
        }

        switch (event) {
            case 'task_init':
                this.status = this.INIT;
                break;

            case 'task_start':
                this.status = this.STARTED;
                this.result = this.INPROGRESS;
                this.timeStarted = timestamp;
                break;

            case 'task_completed':
                this.status = this.COMPLETED;
                break;

            case 'task_success':
                this.result = this.SUCCESS;
                break;

            case 'task_stopped':
                // process results of the task
                this.timeCompleted = timestamp;
                console.log(`\n${this.task} ... ${this.getResultString()}  ${this.device.type}@${this.device.hostname}`);
                processTaskForReport( this.device, this.task, this.getResultString(), this.resultMessage, this.durationString );
                break;

            case 'task_timedout':
                this.status = this.COMPLETED;
                this.result = this.TIMEDOUT;
                if (m.msg !== undefined) this.resultMessage = m.msg;
                break;

            case 'task_error':
                this.status = this.COMPLETED;
                this.result = this.FAILED;
                if (m.msg !== undefined) this.resultMessage = m.msg;
                break;

            case 'task_notapplicable':
                this.status = this.NOTAPPLICABLE;
                this.result = this.NOTAPPLICABLE;
                if (m.msg !== undefined) this.resultMessage = m.msg;
                break;

            case 'step_count':
                this.stepCount = m.msg;
                break;

            case 'step_repeat':
                this.repeating = true;
                if (m.msg) {
                    this.repeatUntil    = m.msg.repeatUntil;
                    this.repeatCount    = m.msg.repeatCount;
                    this.repeatTotal    = m.msg.repeatTotal;
                    this.repeatTimes    = m.msg.repeatTimes;
                    this.repeatFromIdx  = m.msg.fromIdx;
                    this.repeatToIdx    = m.msg.toIdx;
                }

                m.msg.description = `Repeat step ${this.repeatToIdx} to ${this.repeatFromIdx}`;
                m.msg.result = 'SUCCESS';
                this.stepLog.push(m.msg);
                break;

            case 'step_repeat_done':
                this.repeating = false;
                break;

            case 'step_goto':
                this.repeatGoto = m.msg;
                this.repeating = true;
                break;

            case 'step_start':
                this.currentStep = m.msg.step;
                this.stepLog.push(m.msg);
                break;

            case 'step_response':
            /* Disabling storing the responses for now, since we're only in memory
                this.stepLog[ this.stepLog.length-1 ].response = m.msg.response || '';
                this.currentResponse = m.msg.response || '';
            */
                break;


            case 'step_result':
                if (m.msg && m.msg.result && m.msg.result === 'FAIL' && this.status < 2) {
                    this.resultMessage = m.msg.msg;
                    this.result = this.FAILED;
                }

                this.stepLog[ this.stepLog.length-1 ].result = m.msg.result || '';
                this.currentResult = m.msg.result || '';
                break;
        }
    }
}


class Test {
    constructor(name, filename) {
        this.name = name;
        this.filename = filename;
        this.result = 'Not started';
        this.duration = '';
        this.resultMessage = '';
    }

    setResult(result, resultMessage) {
        this.result = result;
        this.resultMessage = resultMessage;
    }

    getName()               { return this.name; }
    getResult()             { return this.result; }
    getResultMessage()      { return this.resultMessage; }
    getDuration()           { return this.duration; }
    setDuration(duration)   { this.duration = duration; }
}


var createCsv = true;
class Report {
    constructor(fwVersion, deviceType) {
        this.fwVersion      = fwVersion;
        this.deviceType     = deviceType;
        this.tests          = {};
        this.testCount      = 0;
        this.testsRun       = 0;
        this.testsSucceeded = 0;
        this.testsFailed    = 0;
        this.testsTimedOut  = 0;
        this.testsNotApplicable = 0;

        this.reportCreated  = moment();

        //init
        this.readTests();
    }


    getList()               { return Object.keys(this.tests);   }
    getTestByName(name)     { return this.tests[ name ];        }
    getFirmwareVersion()    { return this.fwVersion;            }
    getDeviceType()         { return this.deviceType;           }
    getTestResultsString(cb) {
        var results = '';
        var testList = this.getList();

        for (var i=0; i<testList.length; i++) {
            var test = this.tests[ testList[i] ];
            var testName = test.getName();
            var result = test.getResult();
            var padding = '';
            var requiredPadding = 50 - testName.length;

            for (var j=0; j<requiredPadding; j++) {
                padding += ' ';
            }

            results += testName + padding + result + '\n';
            if (result === 'FAILED' || result === 'TIMED OUT') {
                results += '  ' + test.getResultMessage() + '\n';
            }

            if (i >= testList.length-1) cb(results);
        }
    }

    setTestResult(name, result, resultMessage, duration) {
        var test = this.getTestByName(name);
        if (test === undefined || result === undefined)
            return;

        test.setResult(result, resultMessage);
        test.setDuration(duration);

        // write the report on new results
        this.writeResults(false);
    }

    addTest(name, filename) {
        var test = new Test(name, filename);
        this.tests[ name ] = test;
    }

    readTests() {
        var self = this;
        self.tests = {};
        self.testCount = 0;
        cd('./tests/');
        ls('*.js').forEach(function(file) {
            //remove extension and add to testspecs
            if (dummy === undefined || dummy === false)
                if (file.slice(0,5) === 'DUMMY')
                    return;

            var testName = file.slice(0, file.length-3);
            self.addTest(testName, file);
            self.testCount++;
        });
        cd('../');
    }

    parseResults(cb) {
        var testList = this.getList();

        // reset counters
        this.testsRun=0;
        this.testsSucceeded=0;
        this.testsFailed=0;
        this.testsTimedOut=0;
        this.testsNotApplicable=0

        for (var i=0; i<testList.length; i++) {
            var result = this.tests [ testList[i] ].getResult();

            if (result !== 'Not started' && result !== 'Not Applicable')
                this.testsRun++;

            if (result === 'SUCCESS')
                this.testsSucceeded++;

            if (result === 'FAILED')
                this.testsFailed++;

            if (result === 'TIMED OUT')
                this.testsTimedOut++;

            if (result === 'Not Applicable')
                this.testsNotApplicable++;

            if (i >= testList.length-1) cb();
        }
    }

    writeResults(print) {
        if (fs.existsSync('./reports') === false)
            fs.mkdir('./reports');

        var filename = './reports/report-' + this.deviceType + '-' + this.fwVersion + '.txt';
        var header = 'Metrological Test Suite - 2017 (c) Metrological\n\n';

        header += 'Report for:        ' + this.deviceType + '\n';
        header += 'Software firmware: ' + this.fwVersion + '\n';
        header += 'Date of report:    ' + this.reportCreated.format() + '\n';

        this.parseResults( () => {
            var totalTests  = this.testCount - this.testsNotApplicable;
            var passedPerct = Math.round( (this.testsSucceeded/totalTests)*100 );
            var failedPerct = Math.round( (this.testsFailed/totalTests)*100 );
            var timedPerct  = Math.round( (this.testsTimedOut/totalTests)*100 );
            var run         = Math.round( (this.testsRun/totalTests)*100 );

            header += '\n';
            //write test completion message
            header += '--------- Test summary --------- \n';
            header += ' Tests run:        ' + this.testsRun + '\n';
            header += ' Tests OK:         ' + this.testsSucceeded + '\n';
            header += ' Tests failed:     ' + this.testsFailed + '\n';
            header += ' Tests timed out:  ' + this.testsTimedOut + '\n';
            header += ' Tests NA          ' + this.testsNotApplicable + '\n';

            var timeDiffStr = this.reportCreated.from( moment(), true );
            header += ' Tests took:      ' + timeDiffStr + '\n';
            header += '\n';
            header += 'Short summary:\n';
            header += ` OK ${passedPerct}% / NOK ${failedPerct}% / TIMEOUT ${timedPerct} / RUN ${run}% / TOTAL ${this.testCount} tests\n`;
            header += '\n';
            header += '--------------------------------\n';
            header += '\n';

            if (print) console.log(header);
            fs.writeFile(filename, header, (err) => {
                if (err) console.error(err);

                this.getTestResultsString( (results) => {
                    if (print) console.log(results);
                    fs.appendFile(filename, results, (err) => {
                        if (err) console.error(err);
                    });
                });
            });
        });

        // write CSV (if enabled)
        if (createCsv === true) {
            var csvFilename = './reports/report-' + this.deviceType + '-' + this.fwVersion + '.csv';
            var results = 'test|duration|result\n';
            var testList = this.getList();

            for (var i=0; i<testList.length; i++) {
                var test = this.tests[ testList[i] ];
                var seperator = '|';
                var result = test.getResult();

                results += test.getName() + seperator + test.getDuration() + seperator + result;

                if (result === 'FAILED' || result === 'TIMED OUT') {
                    results += seperator + test.getResultMessage() + '\n';
                } else {
                    results += '\n';
                }

                if (i >= testList.length-1) {
                    fs.writeFile(csvFilename, results, (err) => {
                        if (err) console.error(err);
                    });
                }
            }
        }
    }

}

var reports = {};

var tests = [];
var dummy = false;
function readTests() {
    tests = [];
    cd('./tests/');
    ls('*.js').forEach(function(file) {
        // DUMMY
        if (dummy === undefined || dummy === false)
            if (file.slice(0,5) === 'DUMMY')
                return;

        //remove extension and add to testspecs
        var testName = file.slice(0, file.length-3);
        tests.push(testName);
    });
    cd('../');
}
readTests();

// get called when the task process is destructed
function processTaskForReport( device, task, result, resultString, duration ){
    // find firmware in reports, if not create it
    var fwVersion = device.fwVersion !== undefined ? device.fwVersion : 'unknown';

    if (reports[ fwVersion ] === undefined)
        reports[ fwVersion ] = new Report( fwVersion, device.type );

    reports[ fwVersion ].setTestResult( task, result, resultString, duration );
}

/******************************************************************************/
/*****************************      MENUS        ******************************/
/******************************************************************************/

var namespace = '#';
var currentPrompt = '';
var prevCommands = [];
var prevIdx = 0;
var whitespace = 10;
var ctrlced = false;
var showingTaskProgress = false;
var showprog = true;
var selectedAgentIdx, selectedDeviceIdx, selectedTaskIdx;

function clear() {
    process.stdout.write('\x1Bc');
    console.log('Metrological Test Suite - command line interface - 2017 (c) Metrological \n');
}

function menu() {
    clear();
    console.log(`Connected agents: ${agents.length} \n`);

    if (agents.length > 0){
        // loop over active clients
        for (var i=0; i<agents.length; i++){
            if (agents[i].activeDevices === undefined) continue;

            var currentAgent = agents[i];
            console.log(`--- Agent id ${i} - ${currentAgent.identification} ---\n`);

            // get active tasks
            var taskArray = Object.keys(currentAgent.tasks);
            if (taskArray.length > 0) {
                console.log(' Active Tasks:');
                for (var l=0; l<currentAgent.activeTasks.length; l++) {
                    var task = currentAgent.tasks[ currentAgent.activeTasks[l] ];
                    var device = task.getDeviceDetails();
                    console.log(` ${l}. ${device.id} ${device.hostname} ${device.type} ${device.fwVersion ? device.fwVersion : ''}\t ${task.task}\t  ${task.currentStep}/${task.stepCount}  \t${task.getResultString()}`);
                }
            } else {
                console.log(' No active tasks');
            }

            console.log('');

            // get active devices
            var activeDeviceObj = agents[i].activeDevices;
            var activeDevicesList = Object.keys(activeDeviceObj);

            if (activeDevicesList.length > 0) {
                console.log(` Active devices:`);
                for (var k=0; k < activeDevicesList.length; k++){
                    var dev = activeDeviceObj[ activeDevicesList[k] ];
                    console.log(`  ${k}. ${dev.id} ${dev.type} ${dev.dialData ? dev.dialData.manufacturer : '' } ${dev.dialData ? dev.dialData.modelName : ''} ${dev.hostname} ${dev.fwVersion ? dev.fwVersion : ''}`);
                }
            } else {
                console.log(` No active devices`);
            }

            console.log('\n------------------------------------------\n')
        }
    }
}

function programLoop() {
    if (showingTaskProgress === false)
        process.stdout.write(`\r ${namespace}:  ${currentPrompt}`);
}

setInterval(programLoop, 100);

function menu_agents() {
    console.log(`Connected agents: ${agents.length} \n`);


    if (agents.length === 0){
        console.log('No active agents');
    } else {
        // loop over active clients
        console.log('Active agents:');
        for (var i=0; i<agents.length; i++){
            console.log(`  ${i}. ${agents[i].identification}`);
        }
    }
}

function menu_help() {
    var help = 'Help menu\n';
    help += '  menu                       Show main menu\n';
    help += '  tests                      Show list of tasks\n';
    help += '  agents                     Shows current connected agents\n';
    help += '  sel <agent>                Select agent\n';
    help += '  noprog                     Do not automatically show progress when running a task\n';
    help += '  csv                        Toggle writing of the CSV file\n';
    help += '\n';
    help += 'Agent commands:\n';
    help += '  tasks                      Show list of current tasks\n';
    help += '  show <idx>                 Display progress/result of task <idx>\n';
    help += '  discover                   Run discovery\n';
    help += '  devices                    Show all discovered devices\n';
    help += '  add <device|ip> <type>     Add a device by number or hostname and type\n';
    help += '  activedevices|ad           Get & show active devices\n';
    help += '  dev <device>               Select device\n';
    help += '  del <idx>                  Delete a device from active devices\n';
    help += '\n';
    help += 'Device commands:\n';
    help += '  run task|idx|"ALL"         Run by <taskname>, test number <idx> or ALL tests\n';
    help += '\n';
    help += 'Report commands:\n';
    help += '  report list                List active reports\n';
    help += '  report show <idx>          Show status of the report by idx\n';
    help += '  report del <idx>           Delete a report in memory by idx\n';
    help += '  report publish <idx>       Publish a report to git\n';
    help += '\n\n';

    console.log(help);
}

//// DEVICES \\\\

function menu_list_devices() {
    if (agents[selectedAgentIdx] === undefined)
        return;

    var deviceList = agents[selectedAgentIdx].discoveredDevices;
    if (deviceList.length === 0) {
        console.log(`No discovered devices`);
        return;
    }

    console.log(`\nAgent: ${selectedAgentIdx}`);
    console.log(`Discovered device list:`);

    for (var i=0; i<deviceList.length; i++){
        var dev = deviceList[i];
        console.log(`  ${i}. ${dev.dialData.manufacturer} ${dev.dialData.modelName} ${dev.hostname} ${dev.guid}`);
    }
}

function menu_list_active_devices() {
    if (agents[selectedAgentIdx] === undefined)
        return;


    var deviceListObj = agents[selectedAgentIdx].activeDevices;
    var deviceList = Object.keys(deviceListObj);

    if (deviceList.length === 0) {
        console.log(`No active devices`);
        return;
    }

    console.log(`Agent: ${selectedAgentIdx}`);
    console.log(`Active device list:`);

    for (var i=0; i<deviceList.length; i++){
        var dev = deviceListObj[ deviceList[i] ];
        console.log(`  ${i}. ${dev.id} ${dev.type} ${dev.dialData ? dev.dialData.manufacturer : '' } ${dev.dialData ? dev.dialData.modelName : ''} ${dev.hostname} ${dev.fwVersion ? dev.fwVersion : ''}`);
    }
}


/// TASKS \\\

function getActiveTasks() {
    var currentAgent = agents[selectedAgentIdx];
    currentAgent.getActiveTasks();
}

function menu_list_active_tasks() {
    var currentAgent = agents[selectedAgentIdx];
    var taskArray = Object.keys(currentAgent.tasks);

    for (var i=0; i<currentAgent.activeTasks.length; i++) {
        var task = currentAgent.tasks[ currentAgent.activeTasks[i] ];
        var device = task.getDeviceDetails();
        console.log(` ${i}. ${device.id} ${device.hostname} ${device.type} ${device.fwVersion ? device.fwVersion : ''}\t ${task.task}\t  ${task.currentStep}/${task.stepCount} ${task.durationString}  \t${task.getResultString()}`);
    }
}

function showLatestTask() {
    var currentAgent = agents[selectedAgentIdx];
    var lastTask = currentAgent.activeTasks[ currentAgent.activeTasks.length - 1 ];
    showTaskProgressById(lastTask);
}

function showTaskProgressById(id) {
    var currentAgent = agents[selectedAgentIdx];
    var currentTask = currentAgent.tasks[ id ];
    const maxDisplaySteps = 20;
    var taskProgressInterval;

    if (currentTask === undefined)
        return;

    var task = currentTask.task;
    var currentDevice = currentAgent.activeDevices[ currentTask.deviceId ];
    var deviceType = currentDevice.type;
    var deviceHost = currentDevice.hostname;

    function renderTask(task) {
        var description = task.description.slice(0, 40);
        var padding = '';
        var requiredPadding = 50 - description.length;
        for (var j=0; j<requiredPadding; j++) {
            padding += ' ';
        }

        console.log(` ${task.step+1}. ${description} ${padding} ${task.result ? task.result : '...'}`);
    }

    function renderRepeat(idx) {
        // count based
        if (currentTask.repeatCount !== undefined) {
            var repeatProgress = currentTask.repeatTotal - currentTask.repeatCount;
            var repeatProgressBar = '';
            var repeatProgressPerct = Math.round( (repeatProgress/currentTask.repeatTotal) * 100 );
            var repeatProgressBarPerct = Math.round( (repeatProgress/currentTask.repeatTotal) * 50 ); //since we only have 50 chars

            //[>-------------------------------------------------]
            for (var k=0; k<50; k++) {
                if (k < repeatProgressBarPerct)
                    repeatProgressBar += '#';
                else if (k === repeatProgressBarPerct)
                    repeatProgressBar += '>';
                else
                    repeatProgressBar += '-';
            }

            console.log(`Repeating steps ${currentTask.repeatToIdx} to ${currentTask.repeatFromIdx}`);
            console.log(`Progress ${repeatProgress}/${currentTask.repeatTotal} [${repeatProgressBar}] ${repeatProgressPerct}%`);
            console.log('');
        } else {
        // time based
            var timeUntil = moment( currentTask.repeatUntil );
            var timeRemaining = timeUntil.from( moment(), true );

            console.log(`Repeating steps ${currentTask.repeatToIdx} to ${currentTask.repeatFromIdx}`);
            console.log(`Amount of runs done: ${currentTask.repeatTimes} with ${timeRemaining} time remaining`);
            console.log('');
        }
    }

    function renderTaskProgress() {
        if (showingTaskProgress === false) {
            clearInterval(taskProgressInterval);
            return;
        }

        clear();
        var displayedStepLog = [];
        var result = currentTask.getResultString();
        var tS = parseInt(currentTask.stepCount);
        var cS = parseInt(currentTask.currentStep);

        var progressBar = '';
        var progressPerct = Math.round( (cS/tS) * 100 );
        var progressBarPerct = Math.round( (cS/tS) * 50 ); //since we only have 50 chars
        //[>-------------------------------------------------]
        for (var i=0; i<50; i++) {
            if (i < progressBarPerct)
                progressBar += '#';
            else if (i === progressBarPerct)
                progressBar += '>';
            else
                progressBar += '-';
        }

        console.log(`Task: ${task} ${deviceType}@${deviceHost}         Result: ${result}`);
        console.log(`Duration: ${currentTask.durationString}`);
        console.log('');

        if (currentTask.repeating === true) {
            renderRepeat(i);
        }

        console.log(`Progress ${cS}/${tS} [${progressBar}] ${progressPerct}%`);
        console.log('');

        console.log('Steps:');
        var logLength = currentTask.stepLog.length;
        var logStart = 0;
        if (logLength > maxDisplaySteps) {
            logStart = logLength - maxDisplaySteps;
        }

        for (var l=logStart; l<logLength; l++) {
            var _S = currentTask.stepLog[l];
            if (_S === undefined) continue;
            renderTask(_S);
        }

        if (currentTask.status === currentTask.COMPLETED) {
            showingTaskProgress=false;
            if (currentTask.result === currentTask.FAILED || currentTask.status === currentTask.TIMEDOUT) {
                console.log(`\nFailed with message: ${currentTask.resultMessage}`);
            } else {
                console.log('\nTask completed!');
            }
        } else {
            console.log('\nPress Q to close menu');
        }
    }

    showingTaskProgress = true;
    renderTaskProgress();
    taskProgressInterval = setInterval(renderTaskProgress, 1000);
}

//// REPORTS & TESTS \\\\

function show_all_tests(){
    for (var i=0; i<tests.length; i++){
        console.log(`   ${i}. ${tests[i]}`);
    }
}

function showAllReports() {
    var reportList = Object.keys(reports);

    if (reportList.length === 0) {
        console.log('No logged reports available');
        return;
    }

    console.log('Logged reports:');
    for (var i=0; i<reportList.length; i++) {
        var selectedReport = reports[ reportList[i] ];
        console.log(`  ${i}. ${selectedReport.getDeviceType()} - ${selectedReport.getFirmwareVersion()}`);
    }
}

function showReport(idx) {
    var reportList = Object.keys(reports);
    var selectedReport = reports[ reportList[idx] ];

    selectedReport.getTestResultsString( (results) => {
        console.log(results);
    });
}

/******************************************************************************/
/*****************************     COMMANDS      ******************************/
/******************************************************************************/

function updateNamespace() {
    if (selectedAgentIdx !== undefined && selectedDeviceIdx === undefined) {
        namespace = `[agent${selectedAgentIdx}] #`;
    } else if (selectedAgentIdx !== undefined && selectedDeviceIdx !== undefined) {
        namespace = `[agent/${selectedAgentIdx}/dev/${selectedDeviceIdx}] #`;
    } else {
        namespace = '#';
    }
}

function parseCommand(command) {
    process.stdout.write(`\r ${namespace}:  ${currentPrompt} \n`);

    var commandList = command.split(' ');
    var curAgent = agents[selectedAgentIdx];
    var idx, deviceList, newDummyDevice;

    switch (commandList[0].toLowerCase()){
        case 'menu':
            menu();
            break;

        case 'agents':
            menu_agents();
            break;

        case 'discover':
            if (curAgent !== undefined)
                curAgent.discover();

            break;

        case 'devices':
            menu_list_devices();
            break;

        case 'ad':
        case 'activedevices':
            if (curAgent !== undefined)
                curAgent.getActiveDevices();
            break;

        case 'help':
            menu_help();
            break;

        case 'tests':
            show_all_tests();
            break;

        case 'noprog':
            if (showprog === true)
                showprog = false;
            else
                showprog = true;


            console.log(`Automatically showing progress menu is ${showprog===true? 'enabled' : 'disabled'}`);
            break;

        case 'dummyn':
            // no prog dummy
            showprog=false;
            // fall through
        case 'dummy':
            newDummyDevice = new Device('0', '0', 'localhost:81', 'rpi2', { modelName : 'dummy', manufacturer : 'metrological' });
            curAgent.activateDevice(newDummyDevice, 'rpi2');

            // enable dummy mode
            dummy=true;
            readTests();

            setTimeout(parseCommand, 300, 'dev 0'); // auto select it
            break;

        case 'tasks':
            if (curAgent === undefined) {
                console.log('No agent selected, please select agent first');
                break;
            }

            getActiveTasks();
            break;

        case 'sel':
            idx = commandList[1];
            if (agents[idx] === undefined) {
                console.log('Invalid agent id');
            } else {
                selectedAgentIdx = idx;
            }

            break;

        case 'del':
            idx = commandList[1];
            deviceList = Object.keys(curAgent.activeDevices);
            curAgent.deleteDevice(deviceList[idx]);

            if (deviceList[idx] === selectedDeviceIdx)
                selectedDeviceIdx = undefined;

            updateNamespace();
            break;

        case 'add':
            idx = commandList[1];
            var type = commandList[2];

            if (commandList[1] === undefined) {
                console.log('Error no arguments provided to add command. Please provide a idx from discoveredDevices or a hostname');
                return;
            }

            if (deviceTargets[ type ] === undefined) {
                console.log('Error device Type is not recognized');
                return;
            }

            if (type === 'dummy'){
                newDummyDevice = new Device('0', '0', 'localhost', 'rpi2', { modelName : 'dummy', manufacturer : 'metrological' });
                curAgent.activateDevice(newDummyDevice, 'rpi2');
            }

            if (curAgent && curAgent.discoveredDevices[idx] !== undefined){
                curAgent.activateDevice(curAgent.discoveredDevices[idx], type);
            } else if (curAgent && curAgent.discoveredDevices[idx] === undefined) {
                // manual adding a device
                var hostname = commandList[1];

                var d = new Device(undefined, undefined, hostname, type);
                curAgent.activateDevice(d, type);
            }

            deviceList = Object.keys(curAgent.activeDevices);
            setTimeout(parseCommand, 2000, 'dev ' + deviceList.length); // auto select it
            break;

        case 'dev':
            idx = command.split(' ')[1];

            if (curAgent === undefined) {
                console.log('No agent selected, please select agent first');
                break;
            }

            deviceList = Object.keys(curAgent.activeDevices);
            if (deviceList[idx] === undefined) {
                console.log('Invalid device');
                break;
            } else if (deviceList[idx] !== undefined) {
                selectedDeviceIdx = deviceList[idx];
            }

            updateNamespace();
            break;

         case 'run':
            if (commandList[1] === undefined || curAgent === undefined || selectedDeviceIdx === undefined)
                break;


            var task = commandList[1];
            var params = commandList.slice(2, commandList.length);

            // select all
            if (task.toLowerCase() === 'all') {
                console.log('Running all tests at currently selected device');
                var totalTests = tests.length;
                var testIdx = 0;

                function addTest() {
                    if (testIdx<totalTests) {
                        task = tests[testIdx];
                        curAgent.run(selectedDeviceIdx, task, params);
                        testIdx++;
                        setTimeout(addTest, 100);
                    }
                }

                addTest();
                return;
            }

            var taskRange = task.split('-');
            if (taskRange.length > 1) {
                console.log(`Starting tests from ${taskRange[0]} to ${taskRange[1]}`);
                var start = parseInt(taskRange[0]);
                var end = parseInt(taskRange[1]);

                function addTestRange() {
                    if (start<=end) {
                        task = tests[start];
                        curAgent.run(selectedDeviceIdx, task, params);
                        start++;
                        setTimeout(addTestRange, 100);
                    }
                }

                addTestRange();
                return;
            }

            // select by number
            if (isNaN(parseInt(commandList[1])) === false && tests[ commandList[1] ] !== undefined)
                task = tests[ commandList[1] ];

            // execute task!
            curAgent.run(selectedDeviceIdx, task, params);

            // autoshow progress
            if (showprog === true) {
                setTimeout(getActiveTasks, 11000);
                setTimeout(showLatestTask, 12000);
            }
            break;

        case 'show':
            if (curAgent === undefined) {
                console.log('No agent selected, please select agent first');
                break;
            }

            if (curAgent.activeTasks.indexOf(commandList[1] ) !== -1) {
                console.log('Task not found in active task list');
                break;
            }

            var taskId = curAgent.activeTasks[commandList[1]];
            showTaskProgressById( taskId );
            break;

        case 'report':
            var reportList = Object.keys(reports);
            var selectedReport;

            if (commandList[2] !== undefined)
                selectedReport = reports[ reportList[ commandList[2] ] ];

            if (commandList[1] === 'list')
                showAllReports();

            if (commandList[1] === 'show' && selectedReport !== undefined)
                showReport( commandList[2] );

            if (commandList[1] === 'del' && selectedReport !== undefined)
                selectedReport = undefined;

            if (commandList[1] === 'publish' && selectedReport !== undefined)
                selectedReport.writeResults(true);

            break;

        case 'csv':
            if (createCsv === true)
                createCsv = false;
            else
                createCsv = true;

            console.log(`Writing CSV is ${createCsv === true ? 'enabled' : 'disabled'}`);
            break;

        default:
            console.log(`Command ${command} not understood, please type "Help" for a help menu`);

        // see if we need to update our namespace in the prompt
        updateNamespace();
    }
}

// ******************** KEYS **************************** //

const readline = require('readline');

readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);
process.stdin.setRawMode = true;
process.stdin.setEncoding( 'utf8' );
process.stdin.resume();
process.stdin.on('keypress', (chunk, key) => {
    //console.log(chunk);
    //console.log(key);

    // CTRL +C
    if (key && key.ctrl && key.name == 'c' && ctrlced === false) {
        console.log('\n^C (press Ctrl+C again to exit)');
        currentPrompt='';
        ctrlced=true;
    } else if (key && key.name != 'c' && ctrlced === true){
        ctrlced=false;
    } else if (key && key.ctrl && key.name == 'c' && ctrlced === true) {
        console.log('');
        process.exit();
    }

    // Progress menu handling
    if (showingTaskProgress === true && key && key.name === 'q') {
        showingTaskProgress = false;
        return;
    } else if (showingTaskProgress === true) {
        return;
    }

    // Command line
    if (key && key.name === 'return' && currentPrompt.length > 0 && currentPrompt !== ' ') {
        // parse here
        parseCommand(currentPrompt);
        prevCommands.unshift(currentPrompt);
        currentPrompt = '';
    } else if (key && key.name === 'up' && prevCommands.length > 0){
        if (prevIdx >= prevCommands.length) return;

        currentPrompt = prevCommands[ prevIdx ];
        prevIdx++;
    } else if (key && key.name === 'down' && prevCommands.length > 0){
        if (prevIdx === 0) return;

        currentPrompt = prevCommands[ prevIdx ];
        prevIdx--;
    } else if (key && key.name === 'backspace') {
        currentPrompt = currentPrompt.substring(0, currentPrompt.length-1);
    } else if (chunk !== undefined){
        currentPrompt += chunk;
    }
});

/******************************************************************************/
/*****************************      SERVER       ******************************/
/******************************************************************************/

function start() {
    app.get('/', function(req, res) { res.send('<h1>Hello world</h1>'); });
    http.listen(config.port, function(){});
    io.on('connection', function(socket){
        var a = new Agent(socket, agents.length+1);
        agents.push(a);

        if (selectedAgentIdx === undefined){
            selectedAgentIdx=0;
            updateNamespace();
        }

        console.log("Note: You are running in local mode, please ignore the message below that says go to dashboard.metrological.com");
    });

    var _Agent = require('./agent.js');
    var _agent = new _Agent('local@localhost', { 'server' : '127.0.0.1', 'port' : config.port });
    menu();
}

module.exports = {
    'start': start
};
