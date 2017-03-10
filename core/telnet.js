/**
 * WPETestFramework test telnet class
 */
/*jslint esnext: true*/
const Client = require('telnet-client');

module.exports = {
    // Generic execute function, used mostly internally
    exec(opts, cb) {
        if (opts.cmd === undefined) cb(false);

        var conn = new Client();
        conn.on('ready', function() {
            conn.exec(opts.cmd, { irs : '\n', ors: '\r\n' }, function(err, res) {
                if (err) throw new Error(err);

                // since it isnt a readable stream, give exec sometime to finish
                setTimeout(cb, 3000, res);
            });
        }).connect({
            host: host,
            port: 23,
            username: devices[devicetype].username,
            password: devices[devicetype].password,
            timeout: 5 * 60 * 1000,
            debug: false,
            echoLines : 1,
        });

        conn.on('timeout', function(e) {
            throw new Error(`${opts.cmd}: Timeout while connecting to ${host}`);
        });

        conn.on('error', function(err){
            throw new Error(`${opts.cmd}:  ${err}`);
        });
    },
};