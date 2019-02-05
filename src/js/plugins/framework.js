/**
 * WPEFramework API functionality that can be used in test cases
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

    /** send key (press + release) to Framework
     * @param {string} key - Key to be sent to the framework
     * @param {function} cb - Callback function to be called
     * @returns {object}  HTTP response see HTTP in base
     */
    key(key, cb) {
        this.keyPress(key, () => {
            this.keyRelease(key, cb);
        });
    }

    /** send key press to Framework
     * @param {string} key - Key to be sent to the framework
     * @param {function} cb - Callback function to be called
     * @returns {object} HTTP response see HTTP in base
     */
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

    /** send key release to Framework
     * @param {string} key - Key to be sent to the framework
     * @param {function} cb - Callback function to be called
     * @returns {object} HTTP response see HTTP in base
     */
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

    /** set the URL at the Webkit plugin
     * @param {string} url - URL to be set on WebKitBrowser
     * @param {function} cb - Callback function to be called
     * @returns {object} HTTP response see HTTP in base
     */
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

    /** set the URL at the YouTube plugin
     * @param {string} url - URL to be set on YouTube tab
     * @param {function} cb - Callback function to be called
     * @returns {object} HTTP response see HTTP in base
     */
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

    /** retrieve the URL from the Webkit plugin
     * @param {string} x - not used.
     * @param {function} cb - Callback function to be called
     * @returns {object} HTTP response see HTTP in base
     */
    getUrl(x, cb) {
        this.getPlugin('WebKitBrowser', (response) => {
            var resp = JSON.parse(response.body);
            cb(resp.url);
        });
    }

    /** activate/deactivate a plugin using the action call
     * @param {object} options - options to be set
     * @param {string} options.action - Activate|Deactivate
     * @param {string} options.plugin - Plugin Callsign on the WPEFramework API
     * @param {function} cb - Callback function to be called
     * @returns {object} HTTP response see HTTP in base
     */
    controllerActionCall(options, cb) {
        var opts = {
            url     : `http://${host}:80/Service/Controller/${options.action}/${options.plugin}`,
            method  : 'PUT',
        };
        this.http(opts, cb);
    }

    /** activate a plugin using the action call
     * @param {string} plugin - Plugin Callsign on the WPEFramework API
     * @param {function} cb - Callback function to be called
     * @returns {object} HTTP response see HTTP in base
     */
    startPlugin(plugin, cb) {
        var opts = {
            action  : 'Activate',
            plugin  : plugin
        };
        this.controllerActionCall(opts, cb);
    }

    /** start and immediately resume a plugin
     * @param {string} plugin - Plugin Callsign on the WPEFramework API
     * @param {function} cb - Callback function to be called
     * @returns {object} HTTP response see HTTP in base
     */
    startAndResumePlugin(plugin, cb) {
        this.startPlugin(plugin, () => {
            setTimeout(resumePlugin, 300, plugin, cb);
        });
    }

    /** stop a plugin
     * @param {string} plugin - Plugin Callsign on the WPEFramework API
     * @param {function} cb - Callback function to be called
     * @returns {object} HTTP response see HTTP in base
     */
    stopPlugin(plugin, cb) {
        var opts = {
            action  : 'Deactivate',
            plugin  : plugin
        };
        this.controllerActionCall(opts, cb);
    }

    /** switch between plugins
     * @param {string} plugin - Plugin Callsign on the WPEFramework API
     * @param {function} cb - Callback function to be called
     * @returns {object} HTTP response see HTTP in base
     */
    switchPlugin(plugin, cb) {
        var opts = {
            action  : 'Switch',
            plugin  : plugin
        };
        this.controllerActionCall(opts, cb);
    }

    /** start multiple plugins
     * @param {array} plugins - Array with plugin Callsigns that need to be started
     * @param {function} cb - Callback function to be called
     * @returns {object} HTTP response see HTTP in base
     */
    startPlugins(plugins, cb) {
        for (var i=0; i < plugins.length; i++) {
            if (i==plugins.length-1)
                setTimeout(this.startPlugin.bind(this), i * 1000, plugins[i], cb);
            else
                setTimeout(this.startPlugin.bind(this), i * 1000, plugins[i]);
        }
    }

    /** stop multiple plugins
     * @param {array} plugins - Array with plugin Callsigns that need to be stopped
     * @param {function} cb - Callback function to be called
     * @returns {object} HTTP response see HTTP in base
     */
    stopPlugins(plugins, cb) {
        for (var i=0; i < plugins.length; i++) {
            if (i==plugins.length-1)
                setTimeout(this.stopPlugin.bind(this), i * 1000, plugins[i], cb);
            else
                setTimeout(this.stopPlugin.bind(this), i * 1000, plugins[i]);
        }
    }

    /** get the plugin data
     * @param {string} plugin - Callsign of the plugin
     * @param {function} cb - Callback function to be called
     * @returns {object} HTTP response see HTTP in base
     */
    getPlugin(plugin, cb) {
        var opts = {
            url     : `http://${host}:80/Service/${plugin}`,
            method  : 'GET',
        };
        this.http(opts, cb);
    }

    /** get list of plugins from Controller
     * @param {string} x - not used.
     * @param {function} cb - Callback function to be called
     * @returns {object} HTTP response see HTTP in base
     */
    getPlugins(x, cb) {
        var opts = {
            url     : `http://${host}:80/Service/Controller/Plugins`,
            method  : 'GET',
        };
        this.http(opts, cb);
    }

    /** get the state of a plugin, Activated or Deactivated
     * @param {string} plugin - Callsign of the plugin that needs to be queried
     * @param {function} cb - Callback function to be called
     * @returns {string} state - State of the plugin Deactivated|Activated
     */
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

    /** suspend a plugin, note: only works on select plugins (e.g. browser and netflix)
     * @param {string} plugin - Callsign of the plugin
     * @param {function} cb - Callback function to be called
     * @returns {object} HTTP response see HTTP in base
     */
    suspendPlugin(plugin, cb) {
        var opts = {
            url     : `http://${host}:80/Service/${plugin}/Suspend`,
            method  : 'POST'
        };
        this.http(opts, cb);
    }

    /** resume a plugin, note: only works on select plugins (e.g. browser and netflix)
     * @param {string} plugin - Callsign of the plugin
     * @param {function} cb - Callback function to be called
     * @returns {object} HTTP response see HTTP in base
     */
    resumePlugin(plugin, cb) {
        var opts = {
            url     : `http://${host}:80/Service/${plugin}/Resume`,
            method  : 'POST'
        };
        this.http(opts, cb);
    }

    /** reboot using Frameworks reboot API
     * @param {string} x - not used.
     * @param {function} cb - Callback function to be called
     * @returns {object} HTTP response see HTTP in base
     */
    reboot(x, cb) {
        var opts = {
            url     : `http://${host}:80/Service/Controller/Harakiri`,
            method  : 'PUT'
        };
        this.http(opts, cb);
    }

    /** take a screenshot from the framework
     * @param {string} x - not used.
     * @param {function} cb - Callback function to be called
     * @returns {image} image - Base64 encoded image
     */
    screenshot(x, cb) {
        var url = `http://${host}:80/Service/Snapshot/Capture?` + moment().valueOf();

        // use prop fetchImageData defined in task.js that uses the NeedImage class in messages.js to talk to the main thread
        // this is needed because the webworker that runs framework.js cannot processes images
        // processing of images needs to be done on the main thread in a canvas object, so we shoot the image data back and forth
        fetchImageData(url, (imageData) => {
            // returning Base64Image, no need to rely on pngjs. Browsers are cool with images. Much cooler then nodejs.
            cb(imageData);
        });
    }

    /** gets the FPS from the Webkit plugin
     * @param {string} x - not used.
     * @param {function} cb - Callback function to be called
     * @returns {int} FPS - Current FPS
     */
    getFPS(x, cb) {
        this.getPlugin('WebKitBrowser', (response) => {
            var resp = JSON.parse(response.body);
            var fps = parseInt(resp.fps);
            cb(fps);
        });
    }

    /** get the CPU load from deviceinfo
     * @param {string} x - not used.
     * @param {function} cb - Callback function to be called
     * @returns {float} CPU Load
     */
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

    /** get system memory usage
     * @param {string} x - not used.
     * @param {function} cb - Callback function to be called
     * @returns {integer} Memory usage of the device
     */
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

    /** get memory usage from monitor. Note this only applies to plugins that are monitored by the Monitor plugin
     * @param {string} requestedPlugin - Callsign of the plugin that is being monitored by the monitor.
     * @param {function} cb - Callback function to be called
     * @returns {object} Plugin object from monitor plugin
     */
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

    /** start Framework in background mode - FIXME needs to be revised in the webbased version. */
    startFramework(cb) {
        this.exec({ cmd : 'nohup WPEFramework -b &', cbWhenStarted : true }, (err) => {
            if (err)
                throw new Error(err);
            else
                setTimeout(cb, 5000, true);
        });
    }

    /** stop Framework - FIXME needs to be revised in the webbased version. */
    stopFramework(x, cb) {
        this.stopProcess('WPEFramework', cb);
    }

    /** kill (SIGTERM) Framework - FIXME needs to be revised in the webbased version. */
    killFramework(x, cb) {
        this.killProcess('WPEFramework', cb);
    }

    /** kill Framework and its WPEProcess subprocesses - FIXME needs to be revised in the webbased version. */
    killallFramework(x, cb) {
        this.killProcess('WPEFramework', (resp) => {
            if (resp === true)
                killProcess('WPEProcess', cb);
            else
                cb(false);
        });
    }

    /** restart the Framework - FIXME needs to be revised in the webbased version. */
    restartFramework(x, cb) {
        this.killallFramework(x, (resp) => {
            if (resp === true)
                setTimeout(startFramework, 5000, x, cb);
            else
                throw new Error('Error while restarting Framework');
        });
    }

    /** request new provisioning details to the provisioning plugin
     * @param {string} x - not used.
     * @param {function} cb - Callback function to be called
     * @returns {object} HTTP response see HTTP in base
     */
    requestProvisioning(x, cb) {
        var opts = {
            url     : `http://${host}:80/Service/Provisioning`,
            method  : 'PUT'
        };
        this.http(opts, cb);
    }

    /** check if plugin is resumed or activated
     * @param {string} state of the plugin
     * @returns {boolean} True if resumed or activated, throws error if not
     */
    checkResumedOrActivated(state) {
        if (state === 'resumed' || state === 'activated')
            return true;
        else
            throw Error(`Expected state to be resumed or activated, while state was ${state}`);
    }

    /** check if plugin is suspended or deactivated
     * @param {string} state of the plugin
     * @returns {boolean} True if suspended or deactivated, throws error if not
     */
    checkSuspendedOrDeactivated(state) {
        if (state === 'suspended' || state === 'deactivated')
            return true;
        else
            throw Error(`Expected state to be suspended or deactivated, while state was ${state}`);
    }
}

window.plugins = window.plugins || {};
window.plugins.Framework = Framework;
