/*
 * WPETestFramework task runner
 *
 * Copyright (c) 2017 Metrological.com
 *
 */
 /*jslint esnext: true*/
 /*jslint node: true*/

'use strict';
var async = require('async');
const fork = require('child_process').fork;
var argv = require('minimist')(process.argv.slice(2));

var type = argv.deviceType;
var host = argv.host;
var tests = argv.t.split(',');
var args = [];

var testsToBeRunObject = {}

for (var i=0; i<tests.length; i++) {
	var test = tests[i];
	testsToBeRunObject[ test ] = runTest.bind(null, test)
}

function runTest(test, callback) {
	var childProcess = undefined;
	var args = [];
	args.push('-t');
	args.push(test);
	args.push('--deviceType');
	args.push(type);
	args.push('--host');
	args.push(host);
	console.log(`Launching task with args: ${args}`);
	var childProcess = fork('./core/task.js', args);
	childProcess;
	console.log('task_start');
	
	childProcess.on('close', (code) => {
		console.log('task_closed', code);
		callback(null, 'This was a success');
	});
	childProcess.on('error', (err) => {
		console.log('task_error', `Task exited with ${err}`);
		callback();
	});

	childProcess.on('message', (message) => {
		console.log(message);
	});
}

async.series(testsToBeRunObject, function (err, results) {

	if (err)
		process.exit(1);
	else
		process.exit(0);

});