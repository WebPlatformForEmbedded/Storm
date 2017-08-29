/**
 * WPETestFramework WPEFramework functionality
 */
/*jslint esnext: true*/

const Client    = require('ssh2').Client;
const devices   = require('./targets.js').devices;
const moment    = require('moment');
const _http     = require('http');

module.exports = {
    // key definitions
    up : '0x0001', down : '0x0002', right : '0x0004', left : '0x0003', enter : '0x002B', esc : '0x0009',
    // send key to Framework
    key(key, cb) {
        var opts = {
            url     : `http://${host}:80/Service/RemoteControl/Code/${key}`,
            method  : 'PUT'
        };
        http(opts, cb);
    },
    // set the URL at the Webkit plugin
    setUrl(url, cb) {
        var data = JSON.stringify({ 'url' : url });
        var opts = {
            url     : `http://${host}:80/Service/WebKitBrowser/URL`,
            method  : 'POST',
            body    : data,
            headers : { 'Content-Type': 'application/json', 'Content-Length': data.length }
        };
        http(opts, cb);
    },
    setYouTubeUrl(url, cb) {
        var data = JSON.stringify({ 'url' : url });
        var opts = {
            url     : `http://${host}:80/Service/YouTube/URL`,
            method  : 'POST',
            body    : data,
            headers : { 'Content-Type': 'application/json', 'Content-Length': data.length }
        };
        http(opts, cb);
    },
    // retrieve the URL from the Webkit plugin
    getUrl(x, cb) {
        getPlugin('WebKitBrowser', (response) => {
            var resp = JSON.parse(response.body);
            cb(resp.url);
        });
    },
    // activate/deactivate a plugin using the action call
    controllerActionCall(options, cb) {
        var opts = {
            url     : `http://${host}:80/Service/Controller/${options.action}/${options.plugin}`,
            method  : 'PUT',
        };
        http(opts, cb);
    },
    // start a plugin
    startPlugin(plugin, cb) {
        var opts = {
            action  : 'Activate',
            plugin  : plugin
        };
        controllerActionCall(opts, cb);
    },
    // start and immediately resume a plugin
    startAndResumePlugin(plugin, cb) {
        startPlugin(plugin, () => {
            setTimeout(resumePlugin, 300, plugin, cb);
        });
    },
    // stop a plugin
    stopPlugin(plugin, cb) {
        var opts = {
            action  : 'Deactivate',
            plugin  : plugin
        };
        controllerActionCall(opts, cb);
    },
    // switch between plugins
    switchPlugin(plugin, cb) {
        var opts = {
            action  : 'Switch',
            plugin  : plugin
        };
        controllerActionCall(opts, cb);
    },
    // start multiple plugins
    startPlugins(plugins, cb) {
        for (var i=0; i < plugins.length; i++) {
            if (i==plugins.length-1)
                setTimeout(startPlugin, i * 1000, plugins[i], cb);
            else
                setTimeout(startPlugin, i * 1000, plugins[i]);
        }
    },
    // stop multiple plugins
    stopPlugins(plugins, cb) {
        for (var i=0; i < plugins.length; i++) {
            if (i==plugins.length-1)
                setTimeout(stopPlugin, i * 1000, plugins[i], cb);
            else
                setTimeout(stopPlugin, i * 1000, plugins[i]);
        }
    },
    // get the plugin data
    getPlugin(plugin, cb) {
        var opts = {
            url     : `http://${host}:80/Service/${plugin}`,
            method  : 'GET',
        };
        http(opts, cb);
    },
    // get list of plugins
    getPlugins(x, cb) {
        var opts = {
            url     : `http://${host}:80/Service/Controller/Plugins`,
            method  : 'GET',
        };
        http(opts, cb);
    },
    // get the state of a plugin, Activated or Deactivated
    getPluginState(plugin, cb) {
        getPlugin('Controller', (response) => {
            var resp = JSON.parse(response.body);

            for (var i=0; resp.plugins.length; i++) {
                var currentPlugin = resp.plugins[i];
                if (currentPlugin.callsign === plugin) {
                    cb(currentPlugin.state);
                    break;
                }

                if (i === resp.plugins.length-1)
                    throw new Error('Plugin not found in Frameworks response');
            }
        });
    },
    // suspend a plugin, note: only works on select plugins (e.g. browser and netflix)
    suspendPlugin(plugin, cb) {
        var opts = {
            url     : `http://${host}:80/Service/${plugin}/Suspend`,
            method  : 'POST'
        };
        http(opts, cb);
    },
    // resume a plugin, note: only works on select plugins (e.g. browser and netflix)
    resumePlugin(plugin, cb) {
        var opts = {
            url     : `http://${host}:80/Service/${plugin}/Resume`,
            method  : 'POST'
        };
        http(opts, cb);
    },
    // reboot using Frameworks reboot API
    reboot(x, cb) {
        var opts = {
            url     : `http://${host}:80/Service/Controller/Harakiri`,
            method  : 'PUT'
        };
        http(opts, cb);
    },
    screenshot(x, cb) {
        var url = `http://${host}:80/Service/Snapshot/Capture?` + moment().valueOf();

        _http.get(url, function (res){
            if (res.headers['content-length'] === undefined) console.error('Framework did not return a content-length! This will slow down the screenshot module.');

            var buffers = [];
            var imageSize = res.headers['content-length'];

            res.on('data', function(chunk){
                buffers.push( new Buffer(chunk) );
            });

            res.on('end', function(){
                cb( Buffer.concat(buffers, imageSize) );
            });

        }).on('error', function (e){
            console.error(e);
            cb();
        });
    },
    // gets the FPS from the Webkit plugin
    getFPS(x, cb) {
        getPlugin('WebKitBrowser', (response) => {
            var resp = JSON.parse(response.body);
            var fps = parseInt(resp.fps);
            cb(fps);
        });
    },
    // get the CPU load from deviceinfo
    getCpuLoad(x, cb) {
        getPlugin('DeviceInfo', (response) => {
            var resp = JSON.parse(response.body);

            // switch for Master and Stable (stable is camelcase, master is lower case)
            if (resp.SystemInfo !== undefined && resp.systeminfo === undefined) {
                cb(parseFloat(resp.SystemInfo.CpuLoad));
            } else if (resp.SystemInfo === undefined && resp.systeminfo !== undefined) {
                cb(parseFloat(resp.systeminfo.cpuload));
            } else {
                throw Error('Cannot find systemInfo Cpu load on DeviceInfo plugin response');
            }
        });
    },
    // get system memory usage
    getMemoryUsage(x, cb) {
        getPlugin('DeviceInfo', (response) => {
            var resp = JSON.parse(response.body);
            var free, total;

            // switch for Master and Stable (stable is camelcase, master is lower case)
            if (resp.SystemInfo !== undefined && resp.systeminfo === undefined) {
                free = parseInt(resp.SystemInfo.FreeRam);
                total = parseInt(resp.SystemInfo.TotalRam);
            } else if (resp.SystemInfo === undefined && resp.systeminfo !== undefined) {
                free = parseInt(resp.systeminfo.freeram);
                total = parseInt(resp.systeminfo.totalram);
            } else {
                throw Error('Cannot find systemInfo on DeviceInfo plugin response');
            }

            cb(Math.round( (free/total) * 100));
        });
    },
    // get memory usage from monitor
    getMemoryUsageForPlugin(requestedPlugin, cb) {
        getPlugin('Monitor', (response) => {
            var resp = JSON.parse(response.body);

            for (var i=0; i<resp.length; i++) {
                var plugin = resp[i];
                console.log('Checking ' + plugin.name + ' === ' + requestedPlugin);
                if (plugin.name === requestedPlugin) {
                    cb(plugin);
                    return;
                }
            }

            // we failed to find it
            throw Error(`Cannot find ${plugin} in data returned by Monitor`);
        });
    },
    // start Framework in background mode
    startFramework(cb) {
        exec({ cmd : 'nohup WPEFramework -b &', cbWhenStarted : true }, (err) => {
            if (err)
                throw new Error(err);
            else
                setTimeout(cb, 5000, true);
        });
    },
    // stop Framework
    stopFramework(x, cb) {
        stopProcess('WPEFramework', cb);
    },
    // kill (SIGTERM) Framework
    killFramework(x, cb) {
        killProcess('WPEFramework', cb);
    },
    // kill Framework and its WPEProcess subprocesses
    killallFramework(x, cb) {
        killProcess('WPEFramework', (resp) => {
            if (resp === true)
                killProcess('WPEProcess', cb);
            else
                cb(false);
        });
    },
    restartFramework(x, cb) {
        killallFramework(x, (resp) => {
            if (resp === true)
                setTimeout(startFramework, 5000, x, cb);
            else
                throw new Error('Error while restarting Framework');
        });
    },
    requestProvisioning(x, cb) {
        var opts = {
            url     : `http://${host}:80/Service/Provisioning`,
            method  : 'PUT'
        };
        http(opts, cb);
    },
    checkResumedOrActivated(state) {
        if (state === 'resumed' || state === 'activated')
            return true
        else
            throw Error(`Expected state to be resumed or activated, while state was ${state}`);
    },
    checkSuspendedOrDeactivated(state) {
        if (state === 'suspended' || state === 'deactivated')
            return true
        else
            throw Error(`Expected state to be suspended or deactivated, while state was ${state}`);
    }
};
