/*
 * WTF installer for rpi
 */

const username = 'root';
const password = 'root';

var async = require('async');
require('shelljs/global');

//ssh stuff
var Client = require('ssh2').Client;
var cwd = process.cwd();

var argv = require('minimist')(process.argv.slice(2));

// arguments needed
var imageLocation = argv.imageLocation;
host = argv.host;

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

globalize('../core/base.js');
globalize('../core/framework.js');

// run install
async.series({
    'checkSrcFile'      : checkSrcFile.bind(null),
    'currentVersion'    : getFirmwareVersion.bind(null),
    'flashzImage'       : flashzImage.bind(null),
    'flashFirmware'     : flashFirmware.bind(null),
    'sync'              : sync.bind(null),
    'reboot'            : reboot.bind(null),
    'newVersion'        : getFirmwareVersion.bind(null)
}, function (err, results){
    if (err) {
        console.error(err);
        process.exit(1);
    }

    process.exit();
});



function checkSrcFile(callback){
    var err;
    var srcFile = imageLocation + '/zImage';

    console.log(srcFile);
    // check if there is a zImage on the disk, if not bail out
    if (!test('-f', srcFile)) {
        console.error('zImage not found or does not exist, we cannot flash without an zImage.');
        callback('zImage not found');
    } else {
        callback();
    }
}

function getFirmwareVersion(callback){
    getPlugin('DeviceInfo', (resp) => {
        var deviceInfo;
        try {
            deviceInfo = JSON.parse(resp.body);
        } catch (e) {
            callback(e);
            return;
        }

        var version = deviceInfo.systeminfo.version;
        console.log('Firmware version is: ', version);
        callback(null, version);
    });
}

function flashzImage(callback){
    console.log('flashing device: ' + host);

    // using direct ssh2 here, can't use ssh2-connect & exec
    var conn = new Client();
    conn.on('ready', function() {
      conn.sftp(function(err, sftp) {
        if (err) {
            console.error(err);
            callback(err);
        }

        var srcFile = imageLocation + '/zImage';
        sftp.fastPut(srcFile, '/boot/zImage', function(err){
            if (err){
                console.error(err);
                callback(err);
            }

            console.log('succesfully uploaded zImage');
            conn.end();
            callback();
        });
      });
    }).connect({
      host: host,
      port: 22,
      username: username,
      password: password
    });

    conn.on('error', function(err){
        console.error(err);
        callback(err);
    });
}

function flashFirmware(callback){
    if (test('-d', imageLocation + '/rpi-firmware')) {

        var firmwareDir = imageLocation + '/rpi-firmware';
        var files = [];

        if (test('-f', imageLocation + '/bcm2709-rpi-2-b.dtb')) files.push({ src : imageLocation + '/bcm2709-rpi-2-b.dtb', dest : '/boot/bcm2709-rpi-2-b.dtb' });

        cd(firmwareDir);
        ls().forEach(function(file) {
            if (test('-f', firmwareDir + '/' + file)) files.push({ src : firmwareDir + '/' + file, dest : '/boot/' + file });
        });

        // go back to where we came from
        cd(cwd);

        var conn = new Client();
        conn.on('ready', function() {
            conn.sftp(function(err, sftp) {
                if (err) { console.error(err); callback(err); }

                console.log('Updating firmware');

                function putFile(fileObj, c){
                    sftp.fastPut(fileObj.src, fileObj.dest, function(err){
                        if (err) {
                            console.error(err); c(err);
                        } else {
                            c();
                        }
                    });
                }

                var firmwareUpgradeError;
                function uploadFile(err){
                    if (err) { console.error(err); firmwareUpgradeError=err; }

                    if (files.length === 0){
                        conn.end();
                        console.log('Firmware updated succesfully');
                        callback(err);
                    } else {
                        putFile(files.pop(), uploadFile);
                    }
                }

                uploadFile();

            });
        }).connect({
            host: host,
            port: 22,
            username: username,
            password: password
        });

        conn.on('error', function(err){
            console.error(err);
            callback(err);
        });
    } else {
        console.log('Firmware not found, skipping flashing of firmware to rpi');
        callback();
    }
}

function sync(callback) {
    var conn = new Client();
    conn.on('ready', function() {
        conn.exec('sync', function(err, stream) {
            if (err) {
                console.error(err);
            }

            stream.on('close', function(code, signal) {
                if (code === 0) console.log('Synced device');
                if (code !== 0) throw 'Error syncing device';
                conn.end();
                callback();

            }).on('data', function(data) {
                console.log(stdout);
            }).stderr.on('data', function(data) {
                if (options.verbose) console.error('' + data);
            });
        });
    }).connect({
        host: host,
        port: 22,
        username: username,
        password: password
    });

    conn.on('error', function(err){
        console.error(err);
    });
}

function reboot(callback){
    var conn = new Client();
    conn.on('ready', function() {
        conn.exec('/sbin/reboot', function(err, stream) {
            if (err) {
                console.error(err);
            }

            stream.on('close', function(code, signal) {
                if (code === 0) console.log('Succesfully rebooted device');
                if (code !== 0) throw 'Error rebooting device';
                conn.end();
                setTimeout(callback, 30 * 1000); // give it some time to reboot

            }).on('data', function(data) {
                console.log(stdout);
            }).stderr.on('data', function(data) {
                if (options.verbose) console.error('' + data);
            });
        });
    }).connect({
        host: host,
        port: 22,
        username: username,
        password: password
    });

    conn.on('error', function(err){
        console.error(err);
    });
}