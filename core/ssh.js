/**
 * WPETestFramework test ssh class
 */
/*jslint esnext: true*/
'use strict';
const Client    = require('ssh2').Client;

// only works if there is a /var/log/messages present. Hopefully we can improve this with a Framework servce in the future
class AttachToLogs {

    constructor(cb) {
        this.cb     = cb;
        this.re     = /(\bwebbridge\b)/;
        this.conn   = undefined;
    }

    connect(c){
        var self = this;
        var conn = this.conn = new Client();
        conn.on('ready', function() {
            conn.exec('tail -F -n 0 /var/log/messages', function(err, stream) {
                if (err)
                    this.cb(err);

                //console.log('Attached to logs');
                stream.on('close', function(code, signal) {
                    console.warn('detached from logs');
                }).on('data', function(data) {
                    //console.log('' + data);

                    var dataStr = data.toString();
                    var splittedData = dataStr.split('\n');

                    for (var i=0; i<splittedData.length; i++){
                        if (self.re.test(splittedData[i])) {
                            var wpelog = splittedData[i].split('[<<Global>>] ')[1]; // we need to be carefull here, if WPE ever changed there log line, this is where you need to looks
                            self.cb(null, wpelog);
                        }
                    }
                }).stderr.on('data', function(data) {
                    console.error('' + data);
                });

                c();
            });
        }).connect({
            host: host,
            port: 22,
            username: 'root',
            password: 'root'
        });

        conn.on('error', function(err){
            throw Error(err);
        });

        conn.on('close', function(err){
            if (err) console.error('Error when closing ssh socket');
        });

        conn.on('end', function(){
            console.log('Connection ended');
        });
    };

    disconnect() {
        console.log('Closing attachToLogs ssh connection');
        if (this.conn) this.conn.end();
    };
}

module.exports = {
    // Generic ssh execute function, used mostly internally
    exec(opts, cb) {
        var conn = new Client();
        conn.on('ready', function() {
            conn.exec(opts.cmd, function(err, stream) {
                var res = '';
                if (err) throw new Error(`Error starting ${opts.cmd}: ${err}`);
                if (opts.cbWhenStarted === true) cb();

                stream.on('close', function(code, signal) {
                    stream.end();
                    conn.end();
                    //if (res.length > 0) console.log(res);
                    if (opts.cbWhenStarted !== true) cb(res);
                }).on('data', function(data) {
                    res += data;
                }).stderr.on('data', function(data) {
                    //err += data;
                });
            });
        }).connect({
            host: host,
            port: 22,
            username: 'root',
            password: 'root'
        });

        conn.on('timeout', function(e) {
            throw new Error(`{opts.cmd}: Timeout while connecting to ${host}`);
        });

        conn.on('error', function(err){
            throw new Error(`${opts.cmd}:  ${err}`);
        });
    },
    // stop a process on the device
    stopProcess(process, cb) {
        exec({ cmd : `killall ${process}`}, () => {
            cb(true);
        });
    },
    // kill -9 (SIGTERM) a process on the device
    killProcess(process, cb) {
        exec({ cmd : `killall -9 ${process}`} , (err) => {
            cb(true);
        });
    },
    checkIfProcessIsRunning(process, cb) {
        var opts = {
            cmd : `ps w | grep ${process} | grep -v grep | awk ` + "'{printf(" + '"%i \\n\\r", $1)}' + "'"
        };

        exec(opts, (res) => {
            //parse response as integer
            var resp;

            try {
                resp = parseInt(res);
            } catch (e){
                /*..*/
            }

            //only return true if valid number
            cb(isNaN(resp) === false ? true : false);
        });
    },
    // get the CPU usage of a process, returns undefined if the process is not running
    getProcessCpuUsage(process, cb) {
        var opts = {
            cmd : `top -bn1 | grep ${process} | grep -v grep | awk ` + "'{printf(" + '"%i \\n\\r", $7)}' + "'"
        };

        exec(opts, (res) => {
            //parse response as integer
            var resp;
            try {
                resp = parseInt(res);
            } catch (e){
                /*..*/
            }

            //only return if valid number
            cb(isNaN(resp) === false ? resp : undefined);
        });
    },
    // reboot using system reboot
    rebootSystem(x, cb) {
        exec({ cmd : '/sbin/reboot'}, () => {
            cb(true);
        });
    },
    'AttachToLogs' : AttachToLogs
};
