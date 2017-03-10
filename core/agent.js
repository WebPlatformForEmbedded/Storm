/*
 * WPETestFramework
 * main agent logic
 *
 * Copyright (c) 2017 Metrological.com
 *
 */
/*jslint esnext: true*/
/*jslint node: true*/
'use strict';

function Agent(userId, config) {
    const fs = require('fs');
    const http = require('http');
    const URL = require('url');
    const dial = require('peer-dial');
    const fork = require('child_process').fork;
    const moment = require('moment');

    const devices = require('./targets.js').devices;
    const builders = require('./targets.js').builders;
    const Device = require('./device.js');

    var sessionId;
    var activeDevices = {};
    var taskQueue = [];
    var discoveredDevices = [];
    var dialClient;

    /******************************************************************************/
    /*****************************      SOCKET       ******************************/
    /******************************************************************************/

    var io = require('socket.io-client');
    var socket = io.connect(`http://${config.server}:${config.port}`, {reconnect: true});

    socket.on('connect', () => {
        console.log('----------------------------------------------------------------');
        console.log('Agent succesfully connected!');
        console.log('Please go to http://dashboard.metrological.com to use the agent');
        console.log('----------------------------------------------------------------');
    });

    socket.on('connect_error', socket_error);
    socket.on('connect_timeout', socket_error);
    socket.on('reconnect_error', socket_error);
    socket.on('reconnect_failed', socket_error);

    function socket_error(e) {
        console.error(e);
    }

    //// Messages ////
    function sendMessage(type, message) {
        var msg = {
            'type'      : type,
            'body'      : message,
            'timestamp' : moment().toISOString()
        };

        socket.emit('message', msg);
    }

    socket.on('message', (message) => {
        if (message.type === undefined)
            return;

        var type = message.type;
        var body = message.body;

        if (type === 'whoareyou')
            sendMessage('whoami', userId);

        if (type === 'sessionId')
            sessionId = message.body;

        if (type === 'new_task'){
            if (activeDevices[ body.deviceId ] !== undefined){
                activeDevices[ body.deviceId ].queue.push(body);
            }
        }

        if (type === 'stop_task') {
            if (activeDevices[ body.deviceId ] !== undefined && activeDevices[ body.deviceId ].currentTask !== undefined) {
                activeDevices[ body.deviceId ].currentTask.stop(true);
            }
        }

        if (type === 'active_tasks')
            returnActiveTasks();

        if (type === 'activate_device'){
            /* create device */
            activeDevices[ body.id ] = body;
            activeDevices[ body.id ].queue = [];
            sendMessage('device_added', body);
        }

        if (type === 'active_devices') {
            var activeDevicesArray = Object.keys(activeDevices);
            var _activeDevices = {};

            if (activeDevicesArray.length === 0) {
                sendMessage('active_devices', []);
                return;
            }

            for (var i=0; i<activeDevicesArray.length; i++){
                var selectedDevice = activeDevices[ activeDevicesArray[i] ];

                var ad = {
                    'guid'          : selectedDevice.guid,
                    'hostname'      : selectedDevice.hostname,
                    'dialData'      : selectedDevice.dialData,
                    'type'          : selectedDevice.type,
                    'id'            : selectedDevice.id,
                    'fwVersion'     : selectedDevice.fwVersion,
                    'queue'         : selectedDevice.queue,
                    'currentTask'   : selectedDevice.currentTask !== undefined ? selectedDevice.currentTask.id : undefined
                };
                _activeDevices[ selectedDevice.id ] = ad;

                if (i == activeDevicesArray.length-1)
                    sendMessage('active_devices', _activeDevices);
            }
        }

        if (type === 'delete_device') {
            delete activeDevices[ body ];
            sendMessage('device_deleted', body);
        }

        if (type === 'message' && activeDevices[ body.id ].currentTask !== undefined){
            activeDevices[ body.id ].currentTask.send(body.message);
        }

        if (type === 'deviceInfo')
            getDeviceInfo(body);

        if (type === 'discover')
            doDiscover();
    });


    function returnActiveTasks() {
        var activeDevicesArray = Object.keys(activeDevices);
        var activeTasks = [];

        if (activeDevicesArray.length === 0) {
            sendMessage('active_tasks', []);
            return;
        }

        // check we if need to spawn tasks
        for (var i=0; i<activeDevicesArray.length; i++){
            var selectedDevice = activeDevices[ activeDevicesArray[i] ];

            if (selectedDevice.currentTask !== undefined && selectedDevice.currentTask.id !== undefined)
                activeTasks.push(selectedDevice.currentTask.id);

            if (i == activeDevicesArray.length-1)
                sendMessage('active_tasks', activeTasks);
        }
    }

    function getDeviceInfo(hostname){
        var url = 'http://' + hostname + '/Service/DeviceInfo';
        http.get(url, function (res){
            var response = '';
            res.on('data', function(chunk){ response += chunk; });
            res.on('end', function(){
                sendMessage('deviceInfo_response', (JSON.parse(response)));
            });
        }).on('error', function (e){
            sendMessage('deviceInfo_response_error', e);
        });
    }

    function doDiscover(){
        // discover here
        discoveredDevices = [];
        setTimeout(sendDiscoveredDevices, 5 * 1000);

        dialClient = new dial.Client();
        dialClient.on('found', (deviceDescriptionUrl, ssdpHeaders) => {
            var deviceDescriptionUrlParsed = URL.parse(deviceDescriptionUrl);

            if (dialClient !== undefined) {
                dialClient.getDialDevice(deviceDescriptionUrl, function(dialDevice, err) {
                    if (dialDevice) {
                        var url = URL.parse(deviceDescriptionUrl);
                        var newDevice = new Device(undefined, dialDevice.UDN, url.hostname, undefined, dialDevice);
                        discoveredDevices.push(newDevice);
                    } else if (err) {
                        console.error("Error on get DIAL device description from ", deviceDescriptionUrl, err);
                    }
                });
            }
        }).start();
    }

    function sendDiscoveredDevices(){
        dialClient = null;
        sendMessage('discoveredDevices', discoveredDevices);
    }

    // autodetect ip
    var detectedIp;
    require('dns').lookup(require('os').hostname(), function (err, add, fam) {
      detectedIp = add;
    });

    /******************************************************************************/
    /*****************************      QUEUE        ******************************/
    /******************************************************************************/

    /**
     * queueLoop monitors a per device queue and if there is no active task it will spawn a new task per device
     */
    function queueLoop(){
        //if (sessionId === undefined) return; //if there is no session, we can't do anything

        var activeDevicesArray = Object.keys(activeDevices);
        if (activeDevicesArray.length === 0) return; //if there are no active devices, we dont have anything to do anyway

        // check we if need to spawn tasks
        for (var i=0; i<activeDevicesArray.length; i++){
            var selectedDevice = activeDevices[ activeDevicesArray[i] ];

            if (selectedDevice.queue.length === 0) continue; //nothing to do
            if (selectedDevice.currentTask === undefined){
                var toScheduleTask = selectedDevice.queue.shift();
                // create task
                var newTask = new Task(toScheduleTask.id, toScheduleTask.task, selectedDevice.type, selectedDevice.hostname);

                // save task
                selectedDevice.currentTask = newTask;

                // start task
                newTask.start(toScheduleTask.params, () => {
                    selectedDevice.currentTask = undefined;
                });
            }
        }
    }

    setInterval(queueLoop, 10 * 1000);


    /******************************************************************************/
    /*****************************       TASK        ******************************/
    /******************************************************************************/

    class Task {

        constructor(id, task, type, hostname){
            this.id = id;
            this.task = task;
            this.type = type;
            this.hostname = hostname;
            this.childProcess = undefined;
            this.callback = undefined;
        }

        log(event, msg){
            var message = {
                'id'    : this.id,
                'msg'   : msg,
                'event' : event
            };

            sendMessage(event, message);
        }

        rawLog(event, msg){
            sendMessage(event, msg);
        }

        stop(force){
            if (this.childProcess) this.childProcess.kill();
            if (force === true)
                this.log('task_forced_stop');
            else
                this.log('task_stopped');

            if (this.callback) this.callback();
        }

        send(message){
            if (this.childProcess) this.childProcess.send(message);
        }

        start(params, callback){
            var self = this;
            this.callback = callback;
            var args = [];
            params = params ? params : [];

            switch (this.task){
                case 'build':
                    args.push('-b');
                    break;

                case 'install':
                    args.push('-i');
                    break;

                default:
                    args.push('-t');
                    args.push(this.task);
            }

            args.push('--taskId');
            args.push(this.id);
            args.push('--devicetype');
            args.push(this.type);
            args.push('--host');
            args.push(this.hostname);

            if (params) args.push(params);

            console.log(`Launching task with args: ${args}`);

            this.childProcess = fork('./core/task.js', args);
            this.log('task_start', this.task);

            this.childProcess.on('close', (code) => {
                this.log('task_closed', code);
                this.stop();
            });

            this.childProcess.on('error', (err) => {
                this.log('task_error', `Task exited with ${err}`);
                this.stop();
            });

            /*
            this.childProcess.stdout.on('data', (data) => {
              console.log(`stdout: ${data}`);
            });

            this.childProcess.stderr.on('data', (data) => {
              console.log(`stderr: ${data}`);
            });
            */

            // need to handle async updates on progress here... I guess?
            this.childProcess.on('message', (m) => {
                if (m && m instanceof Object) m.id = this.id;
                this.rawLog(m.event, m);
            });
        }
    }
}

module.exports = Agent;
