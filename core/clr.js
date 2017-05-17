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
var tests;
var testManifest = argv.testManifest;
var args = [];

var testsFailed = 0;

if (testManifest !== undefined)
	tests = require('../manifests/' + testManifest + '.json');
else
	tests = argv.t.split(',');

var testsToBeRunObject = {}

for (var i=0; i<tests.length; i++) {
	var test = tests[i];
	testsToBeRunObject[ test ] = runTest.bind(null, test)
}

function runTest(test, callback) {
	var steps = 0,
		curStep = 0,
		description = '';

	var args = [];
	args.push('-t');
	args.push(test);
	args.push('--deviceType');
	args.push(type);
	args.push('--host');
	args.push(host);

	console.log(`Launching test ${test}`);
	var childProcess = fork('./core/task.js', args);

	childProcess.on('close', (code) => {
		if (code === 0) {
			console.log(`Test ${test} completed succesfully`);
		} else {
			console.error(`Test ${test} completed with errors`);
			testsFailed++;
		}

		console.log();
		callback();
	});
	childProcess.on('error', (err) => {
		callback(err);
	});

	childProcess.on('message', (e) => {
		//console.log(e);

		if (e.event === 'step_count')
			steps = e.msg;

		if (e.event === 'step_start' && e.msg !== undefined) {
			curStep = e.msg.step;
			description = e.msg.description.slice(0, 50);
		}

		if (e.event === 'step_repeat')
			console.log(`   Repeating step ${e.msg.toIdx} to ${e.msg.fromIdx} for ${e.msg.repeatTotal !== undefined ? e.msg.repeatTotal : e.msg.repeatUntil} times`);

		if (e.event === 'step_result') {
            var requiredPadding = 50 - description.length;
            var padding = '';

            for (var j=0; j<requiredPadding; j++) {
                padding += '.';
            }

			console.log(`   Step [ ${curStep < 9 ? '0' + curStep : curStep}/${steps < 9 ? '0' + steps : steps} ] - ${description} ${padding} ${e.msg.result} `);
		}

		if (e.event === 'task_error')
			console.error(`Error: ` + e.msg);

		if (e.event === 'task_timedout')
			console.error(`Test timed out`);

		if (e.event === 'task_notapplicable')
			console.log('Test is not applicable');

	});
}

async.series(testsToBeRunObject, function (err, results) {
	var msg = `\nCompleted ${tests.length} tests of which ${testsFailed} failed`;

	if (err || testsFailed > 0) {
		console.error(msg);
		process.exit(1);
	} else {
		console.log(msg);
		process.exit(0);
	}

});