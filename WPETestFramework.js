/*
 * WPETestFramework
 * Automated test runner for Metrological written in Bash. Just looks allot like python, but sometimes javascript.
 *
 * Copyright (c) 2017 Metrological.com
 *
 */

/* jshint strict: true */
/* jshint node: true */

process.stdout.write('WPETestFramework - 2017 (c) Metrological\n');
process.stdout.write('\r Initializing... \n');

var help ='Please provide your user identification when starting the WPETestFramework client using the -u flag\n';
help+='For example:\n';
help+='node WPETestFramework.js -u WPETestFramework@metrological.com\n\n';
help+='This is the same user id as used to login into the Metrological dashboard';

var local = false; // run local/stub mode
var argv = require('minimist')(process.argv.slice(2));
if (argv.l !== undefined) local=true;

var user = argv.u;

if (user === undefined && local === false) {
    console.log(help);

} else if (local === true) {
    // Start the local command line interface
    var cli = require('./core/cli.js');
    cli.start();

} else {
    // launch the agent
    var Agent = require('./core/agent.js');
    const config = require('./core/config.js');
    var agent = new Agent(user, config);

}