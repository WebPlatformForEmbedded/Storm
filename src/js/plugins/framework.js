/**
 * WPETestFramework WPEFramework functionality
 */

class Framework extends Base {
    constructor() {
        super();

        this.up       = '0x0001';
        this.down     = '0x0002';
        this.right    = '0x0004';
        this.left     = '0x0003';
        this.enter    = '0x002B';
        this.esc      = '0x0009';

        // expose functions
        this.key                    = this.key.bind(this);
        this.keyPress               = this.keyPress.bind(this);
        this.keyRelease             = this.keyRelease.bind(this);
        this.setUrl                 = this.setUrl.bind(this);
        this.setYouTubeUrl          = this.setYouTubeUrl.bind(this);
        this.getUrl                 = this.getUrl.bind(this);
        this.controllerActionCall   = this.controllerActionCall.bind(this);
        this.startPlugin            = this.startPlugin.bind(this);
        this.startAndResumePlugin   = this.startAndResumePlugin.bind(this);
        this.stopPlugin             = this.stopPlugin.bind(this);
        this.switchPlugin           = this.switchPlugin.bind(this);
        this.startPlugins           = this.startPlugins.bind(this);
        this.stopPlugins            = this.stopPlugins.bind(this);
        this.getPlugin              = this.getPlugin.bind(this);
        this.getPlugins             = this.getPlugins.bind(this);
        this.getPluginState         = this.getPluginState.bind(this);
        this.suspendPlugin          = this.suspendPlugin.bind(this);
        this.resumePlugin           = this.resumePlugin.bind(this);
        this.screenshot             = this.screenshot.bind(this);
        this.getFPS                 = this.getFPS.bind(this);
        this.reboot                 = this.reboot.bind(this);
        this.getCpuLoad             = this.getCpuLoad.bind(this);
        this.getMemoryUsage         = this.getMemoryUsage.bind(this);
        this.getMemoryUsageForPlugin = this.getMemoryUsageForPlugin.bind(this);
        this.restartFramework       = this.restartFramework.bind(this);
        this.startFramework         = this.startFramework.bind(this);
        this.stopFramework          = this.stopFramework.bind(this);
        this.killFramework          = this.killFramework.bind(this);
        this.killallFramework       = this.killallFramework.bind(this);
        this.requestProvisioning    = this.requestProvisioning.bind(this);
        this.checkResumedOrActivated = this.checkResumedOrActivated.bind(this);
        this.checkSuspendedOrDeactivated = this.checkSuspendedOrDeactivated.bind(this);

    }

    // send key (press + release) to Framework
    key(key, cb) {
        this.keyPress(key, () => {
            this.keyRelease(key, cb);
        });
    }

    // send key press
    keyPress(key, cb) {
        var data = JSON.stringify({ 'code' : key });
        var opts = {
            url     : `http://${host}:80/Service/RemoteControl/keymap/Press`,
            body    : data,
            method  : 'PUT',
            headers : { 'Content-Type': 'application/json', 'Content-Length': data.length }
        };
        this.http(opts, cb);
    }

    // send key release
    keyRelease(key, cb) {
        var data = JSON.stringify({ 'code' : key });
        var opts = {
            url     : `http://${host}:80/Service/RemoteControl/keymap/Release`,
            body    : data,
            method  : 'PUT',
            headers : { 'Content-Type': 'application/json', 'Content-Length': data.length }
        };
        this.http(opts, cb);
    }

    // set the URL at the Webkit plugin
    setUrl(url, cb) {
        var data = JSON.stringify({ 'url' : url });
        var opts = {
            url     : `http://${host}:80/Service/WebKitBrowser/URL`,
            method  : 'POST',
            body    : data,
            headers : { 'Content-Type': 'application/json', 'Content-Length': data.length }
        };
        this.http(opts, cb);
    }

    setYouTubeUrl(url, cb) {
        var data = JSON.stringify({ 'url' : url });
        var opts = {
            url     : `http://${host}:80/Service/YouTube/URL`,
            method  : 'POST',
            body    : data,
            headers : { 'Content-Type': 'application/json', 'Content-Length': data.length }
        };
        this.http(opts, cb);
    }

    // retrieve the URL from the Webkit plugin
    getUrl(x, cb) {
        this.getPlugin('WebKitBrowser', (response) => {
            var resp = JSON.parse(response.body);
            cb(resp.url);
        });
    }

    // activate/deactivate a plugin using the action call
    controllerActionCall(options, cb) {
        var opts = {
            url     : `http://${host}:80/Service/Controller/${options.action}/${options.plugin}`,
            method  : 'PUT',
        };
        this.http(opts, cb);
    }

    // start a plugin
    startPlugin(plugin, cb) {
        var opts = {
            action  : 'Activate',
            plugin  : plugin
        };
        this.controllerActionCall(opts, cb);
    }

    // start and immediately resume a plugin
    startAndResumePlugin(plugin, cb) {
        this.startPlugin(plugin, () => {
            setTimeout(resumePlugin, 300, plugin, cb);
        });
    }

    // stop a plugin
    stopPlugin(plugin, cb) {
        var opts = {
            action  : 'Deactivate',
            plugin  : plugin
        };
        this.controllerActionCall(opts, cb);
    }

    // switch between plugins
    switchPlugin(plugin, cb) {
        var opts = {
            action  : 'Switch',
            plugin  : plugin
        };
        this.controllerActionCall(opts, cb);
    }

    // start multiple plugins
    startPlugins(plugins, cb) {
        for (var i=0; i < plugins.length; i++) {
            if (i==plugins.length-1)
                setTimeout(this.startPlugin.bind(this), i * 1000, plugins[i], cb);
            else
                setTimeout(this.startPlugin.bind(this), i * 1000, plugins[i]);
        }
    }

    // stop multiple plugins
    stopPlugins(plugins, cb) {
        for (var i=0; i < plugins.length; i++) {
            if (i==plugins.length-1)
                setTimeout(this.stopPlugin.bind(this), i * 1000, plugins[i], cb);
            else
                setTimeout(this.stopPlugin.bind(this), i * 1000, plugins[i]);
        }
    }

    // get the plugin data
    getPlugin(plugin, cb) {
        var opts = {
            url     : `http://${host}:80/Service/${plugin}`,
            method  : 'GET',
        };
        this.http(opts, cb);
    }

    // get list of plugins
    getPlugins(x, cb) {
        var opts = {
            url     : `http://${host}:80/Service/Controller/Plugins`,
            method  : 'GET',
        };
        this.http(opts, cb);
    }

    // get the state of a plugin, Activated or Deactivated
    getPluginState(plugin, cb) {
        this.getPlugin('Controller', (response) => {
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
    }

    // suspend a plugin, note: only works on select plugins (e.g. browser and netflix)
    suspendPlugin(plugin, cb) {
        var opts = {
            url     : `http://${host}:80/Service/${plugin}/Suspend`,
            method  : 'POST'
        };
        this.http(opts, cb);
    }

    // resume a plugin, note: only works on select plugins (e.g. browser and netflix)
    resumePlugin(plugin, cb) {
        var opts = {
            url     : `http://${host}:80/Service/${plugin}/Resume`,
            method  : 'POST'
        };
        this.http(opts, cb);
    }

    // reboot using Frameworks reboot API
    reboot(x, cb) {
        var opts = {
            url     : `http://${host}:80/Service/Controller/Harakiri`,
            method  : 'PUT'
        };
        this.http(opts, cb);
    }

    screenshot(x, cb) {
        var url = `http://${host}:80/Service/Snapshot/Capture?` + moment().valueOf();
        var a = new Image();
        a.src = url;

        // returning Base64Image, no need to rely on pngjs. Browsers are cool with images. Much cooler then nodejs.
        cb(getBase64Image(a));
    }

    // gets the FPS from the Webkit plugin
    getFPS(x, cb) {
        this.getPlugin('WebKitBrowser', (response) => {
            var resp = JSON.parse(response.body);
            var fps = parseInt(resp.fps);
            cb(fps);
        });
    }

    // get the CPU load from deviceinfo
    getCpuLoad(x, cb) {
        this.getPlugin('DeviceInfo', (response) => {
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
    }

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
    }

    // get memory usage from monitor
    getMemoryUsageForPlugin(requestedPlugin, cb) {
        this.getPlugin('Monitor', (response) => {
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
            throw Error(`Cannot find ${requestedPlugin} in data returned by Monitor`);
        });
    }

    // start Framework in background mode
    startFramework(cb) {
        this.exec({ cmd : 'nohup WPEFramework -b &', cbWhenStarted : true }, (err) => {
            if (err)
                throw new Error(err);
            else
                setTimeout(cb, 5000, true);
        });
    }

    // stop Framework
    stopFramework(x, cb) {
        this.stopProcess('WPEFramework', cb);
    }

    // kill (SIGTERM) Framework
    killFramework(x, cb) {
        this.killProcess('WPEFramework', cb);
    }

    // kill Framework and its WPEProcess subprocesses
    killallFramework(x, cb) {
        this.killProcess('WPEFramework', (resp) => {
            if (resp === true)
                killProcess('WPEProcess', cb);
            else
                cb(false);
        });
    }

    restartFramework(x, cb) {
        this.killallFramework(x, (resp) => {
            if (resp === true)
                setTimeout(startFramework, 5000, x, cb);
            else
                throw new Error('Error while restarting Framework');
        });
    }

    requestProvisioning(x, cb) {
        var opts = {
            url     : `http://${host}:80/Service/Provisioning`,
            method  : 'PUT'
        };
        this.http(opts, cb);
    }

    checkResumedOrActivated(state) {
        if (state === 'resumed' || state === 'activated')
            return true;
        else
            throw Error(`Expected state to be resumed or activated, while state was ${state}`);
    }

    checkSuspendedOrDeactivated(state) {
        if (state === 'suspended' || state === 'deactivated')
            return true;
        else
            throw Error(`Expected state to be suspended or deactivated, while state was ${state}`);
    }
}

window.plugins = window.plugins || {};
window.plugins.Framework = Framework;
