## Classes

<dl>
<dt><a href="#Base">Base</a></dt>
<dd><p>WPETestFramework test base class. Provides base functionality to be used in the Tests</p>
</dd>
<dt><a href="#Framework">Framework</a></dt>
<dd><p>WPEFramework API functionality that can be used in test cases</p>
</dd>
</dl>

<a name="Base"></a>

## Base
WPETestFramework test base class. Provides base functionality to be used in the Tests

**Kind**: global class  

* [Base](#Base)
    * [.sleep(x, cb)](#Base+sleep)
    * [.get(url, cb)](#Base+get)
    * [.http(options, cb)](#Base+http) ⇒ <code>object</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>string</code>
    * [.httpResponseSimple(url)](#Base+httpResponseSimple) ⇒ <code>boolean</code>
    * [.httpResponseBody(url)](#Base+httpResponseBody) ⇒ <code>boolean</code>
    * [.jsonParse(x, cb)](#Base+jsonParse) ⇒ <code>boolean</code>
    * [.checkIfObject(x)](#Base+checkIfObject) ⇒ <code>boolean</code>
    * [.startHttpServer()](#Base+startHttpServer)
    * [.startFileServer()](#Base+startFileServer)
    * [.matchIpRange()](#Base+matchIpRange)

<a name="Base+sleep"></a>

### base.sleep(x, cb)
Sleep waits X amounts of seconds

**Kind**: instance method of [<code>Base</code>](#Base)  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>int</code> | Time to sleep in seconds |
| cb | <code>function</code> | Callback after sleep is done |

<a name="Base+get"></a>

### base.get(url, cb)
HTTP GET a specific URL

**Kind**: instance method of [<code>Base</code>](#Base)  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | URL that needs to be retrieved |
| cb | <code>function</code> | Callback with the results of the GET. See HTTP for more information. |

<a name="Base+http"></a>

### base.http(options, cb) ⇒ <code>object</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>string</code> \| <code>string</code>
HTTP GET a specific URL

**Kind**: instance method of [<code>Base</code>](#Base)  
**Returns**: <code>object</code> - response - Returns a response object<code>string</code> - response.error -  Returns an error string if the request failed<code>string</code> - response.headers - Return headers from the response<code>string</code> - response.body - Body of the response<code>string</code> - response.status - HTTP status code for the response<code>string</code> - response.statusMessage - HTTP Status message for the response  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>options</code> | Object with the following properties: |
| options.url | <code>string</code> | Url to be called |
| options.method | <code>string</code> | Method to be used, GET/POST/PUT/DELETE |
| options.body | <code>string</code> | Optional body to be sent in the request (note only useful for PUT/POST) |
| cb | <code>function</code> | Callback with the results of the GET. |

<a name="Base+httpResponseSimple"></a>

### base.httpResponseSimple(url) ⇒ <code>boolean</code>
Check the response of HTTP. Utility function that checks if the response status was < 400

**Kind**: instance method of [<code>Base</code>](#Base)  
**Returns**: <code>boolean</code> - Returns true if correct, throws error if it has an error  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>object</code> | HTTP response object |

<a name="Base+httpResponseBody"></a>

### base.httpResponseBody(url) ⇒ <code>boolean</code>
Check the response of HTTP. Utility function that checks if the response status was < 400 and has a body

**Kind**: instance method of [<code>Base</code>](#Base)  
**Returns**: <code>boolean</code> - Returns true if correct, throws error if it has an error  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>object</code> | HTTP response object |

<a name="Base+jsonParse"></a>

### base.jsonParse(x, cb) ⇒ <code>boolean</code>
Checks if the response can be parsed using JSON

**Kind**: instance method of [<code>Base</code>](#Base)  
**Returns**: <code>boolean</code> - Returns if correct, throws error if it has an error  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>string</code> | JSON string object |
| cb | <code>function</code> | Callback function |

<a name="Base+checkIfObject"></a>

### base.checkIfObject(x) ⇒ <code>boolean</code>
Check if the response is an object

**Kind**: instance method of [<code>Base</code>](#Base)  
**Returns**: <code>boolean</code> - Returns true if correct, throws error if it has an error  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>object</code> | object |

<a name="Base+startHttpServer"></a>

### base.startHttpServer()
Deprecated startHttpServer

**Kind**: instance method of [<code>Base</code>](#Base)  
<a name="Base+startFileServer"></a>

### base.startFileServer()
Deprecated startFileServer

**Kind**: instance method of [<code>Base</code>](#Base)  
<a name="Base+matchIpRange"></a>

### base.matchIpRange()
Deprecated matchIpRange

**Kind**: instance method of [<code>Base</code>](#Base)  
<a name="Framework"></a>

## Framework
WPEFramework API functionality that can be used in test cases

**Kind**: global class  

* [Framework](#Framework)
    * [.key(key, cb)](#Framework+key) ⇒ <code>object</code>
    * [.keyPress(key, cb)](#Framework+keyPress) ⇒ <code>object</code>
    * [.keyRelease(key, cb)](#Framework+keyRelease) ⇒ <code>object</code>
    * [.setUrl(url, cb)](#Framework+setUrl) ⇒ <code>object</code>
    * [.setYouTubeUrl(url, cb)](#Framework+setYouTubeUrl) ⇒ <code>object</code>
    * [.getUrl(x, cb)](#Framework+getUrl) ⇒ <code>object</code>
    * [.controllerActionCall(options, cb)](#Framework+controllerActionCall) ⇒ <code>object</code>
    * [.startPlugin(plugin, cb)](#Framework+startPlugin) ⇒ <code>object</code>
    * [.startAndResumePlugin(plugin, cb)](#Framework+startAndResumePlugin) ⇒ <code>object</code>
    * [.stopPlugin(plugin, cb)](#Framework+stopPlugin) ⇒ <code>object</code>
    * [.switchPlugin(plugin, cb)](#Framework+switchPlugin) ⇒ <code>object</code>
    * [.startPlugins(plugins, cb)](#Framework+startPlugins) ⇒ <code>object</code>
    * [.stopPlugins(plugins, cb)](#Framework+stopPlugins) ⇒ <code>object</code>
    * [.getPlugin(plugin, cb)](#Framework+getPlugin) ⇒ <code>object</code>
    * [.getPlugins(x, cb)](#Framework+getPlugins) ⇒ <code>object</code>
    * [.getPluginState(plugin, cb)](#Framework+getPluginState) ⇒ <code>string</code>
    * [.suspendPlugin(plugin, cb)](#Framework+suspendPlugin) ⇒ <code>object</code>
    * [.resumePlugin(plugin, cb)](#Framework+resumePlugin) ⇒ <code>object</code>
    * [.reboot(x, cb)](#Framework+reboot) ⇒ <code>object</code>
    * [.screenshot(x, cb)](#Framework+screenshot) ⇒ <code>image</code>
    * [.getFPS(x, cb)](#Framework+getFPS) ⇒ <code>int</code>
    * [.getCpuLoad(x, cb)](#Framework+getCpuLoad) ⇒ <code>float</code>
    * [.getMemoryUsage(x, cb)](#Framework+getMemoryUsage) ⇒ <code>integer</code>
    * [.getMemoryUsageForPlugin(requestedPlugin, cb)](#Framework+getMemoryUsageForPlugin) ⇒ <code>object</code>
    * [.startFramework()](#Framework+startFramework)
    * [.stopFramework()](#Framework+stopFramework)
    * [.killFramework()](#Framework+killFramework)
    * [.killallFramework()](#Framework+killallFramework)
    * [.restartFramework()](#Framework+restartFramework)
    * [.requestProvisioning(x, cb)](#Framework+requestProvisioning) ⇒ <code>object</code>
    * [.checkResumedOrActivated(state)](#Framework+checkResumedOrActivated) ⇒ <code>boolean</code>
    * [.checkSuspendedOrDeactivated(state)](#Framework+checkSuspendedOrDeactivated) ⇒ <code>boolean</code>

<a name="Framework+key"></a>

### framework.key(key, cb) ⇒ <code>object</code>
send key (press + release) to Framework

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>object</code> - HTTP response see HTTP in base  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Key to be sent to the framework |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+keyPress"></a>

### framework.keyPress(key, cb) ⇒ <code>object</code>
send key press to Framework

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>object</code> - HTTP response see HTTP in base  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Key to be sent to the framework |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+keyRelease"></a>

### framework.keyRelease(key, cb) ⇒ <code>object</code>
send key release to Framework

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>object</code> - HTTP response see HTTP in base  

| Param | Type | Description |
| --- | --- | --- |
| key | <code>string</code> | Key to be sent to the framework |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+setUrl"></a>

### framework.setUrl(url, cb) ⇒ <code>object</code>
set the URL at the Webkit plugin

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>object</code> - HTTP response see HTTP in base  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | URL to be set on WebKitBrowser |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+setYouTubeUrl"></a>

### framework.setYouTubeUrl(url, cb) ⇒ <code>object</code>
set the URL at the YouTube plugin

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>object</code> - HTTP response see HTTP in base  

| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> | URL to be set on YouTube tab |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+getUrl"></a>

### framework.getUrl(x, cb) ⇒ <code>object</code>
retrieve the URL from the Webkit plugin

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>object</code> - HTTP response see HTTP in base  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>string</code> | not used. |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+controllerActionCall"></a>

### framework.controllerActionCall(options, cb) ⇒ <code>object</code>
activate/deactivate a plugin using the action call

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>object</code> - HTTP response see HTTP in base  

| Param | Type | Description |
| --- | --- | --- |
| options | <code>object</code> | options to be set |
| options.action | <code>string</code> | Activate|Deactivate |
| options.plugin | <code>string</code> | Plugin Callsign on the WPEFramework API |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+startPlugin"></a>

### framework.startPlugin(plugin, cb) ⇒ <code>object</code>
activate a plugin using the action call

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>object</code> - HTTP response see HTTP in base  

| Param | Type | Description |
| --- | --- | --- |
| plugin | <code>string</code> | Plugin Callsign on the WPEFramework API |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+startAndResumePlugin"></a>

### framework.startAndResumePlugin(plugin, cb) ⇒ <code>object</code>
start and immediately resume a plugin

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>object</code> - HTTP response see HTTP in base  

| Param | Type | Description |
| --- | --- | --- |
| plugin | <code>string</code> | Plugin Callsign on the WPEFramework API |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+stopPlugin"></a>

### framework.stopPlugin(plugin, cb) ⇒ <code>object</code>
stop a plugin

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>object</code> - HTTP response see HTTP in base  

| Param | Type | Description |
| --- | --- | --- |
| plugin | <code>string</code> | Plugin Callsign on the WPEFramework API |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+switchPlugin"></a>

### framework.switchPlugin(plugin, cb) ⇒ <code>object</code>
switch between plugins

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>object</code> - HTTP response see HTTP in base  

| Param | Type | Description |
| --- | --- | --- |
| plugin | <code>string</code> | Plugin Callsign on the WPEFramework API |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+startPlugins"></a>

### framework.startPlugins(plugins, cb) ⇒ <code>object</code>
start multiple plugins

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>object</code> - HTTP response see HTTP in base  

| Param | Type | Description |
| --- | --- | --- |
| plugins | <code>array</code> | Array with plugin Callsigns that need to be started |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+stopPlugins"></a>

### framework.stopPlugins(plugins, cb) ⇒ <code>object</code>
stop multiple plugins

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>object</code> - HTTP response see HTTP in base  

| Param | Type | Description |
| --- | --- | --- |
| plugins | <code>array</code> | Array with plugin Callsigns that need to be stopped |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+getPlugin"></a>

### framework.getPlugin(plugin, cb) ⇒ <code>object</code>
get the plugin data

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>object</code> - HTTP response see HTTP in base  

| Param | Type | Description |
| --- | --- | --- |
| plugin | <code>string</code> | Callsign of the plugin |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+getPlugins"></a>

### framework.getPlugins(x, cb) ⇒ <code>object</code>
get list of plugins from Controller

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>object</code> - HTTP response see HTTP in base  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>string</code> | not used. |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+getPluginState"></a>

### framework.getPluginState(plugin, cb) ⇒ <code>string</code>
get the state of a plugin, Activated or Deactivated

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>string</code> - state - State of the plugin Deactivated|Activated  

| Param | Type | Description |
| --- | --- | --- |
| plugin | <code>string</code> | Callsign of the plugin that needs to be queried |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+suspendPlugin"></a>

### framework.suspendPlugin(plugin, cb) ⇒ <code>object</code>
suspend a plugin, note: only works on select plugins (e.g. browser and netflix)

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>object</code> - HTTP response see HTTP in base  

| Param | Type | Description |
| --- | --- | --- |
| plugin | <code>string</code> | Callsign of the plugin |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+resumePlugin"></a>

### framework.resumePlugin(plugin, cb) ⇒ <code>object</code>
resume a plugin, note: only works on select plugins (e.g. browser and netflix)

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>object</code> - HTTP response see HTTP in base  

| Param | Type | Description |
| --- | --- | --- |
| plugin | <code>string</code> | Callsign of the plugin |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+reboot"></a>

### framework.reboot(x, cb) ⇒ <code>object</code>
reboot using Frameworks reboot API

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>object</code> - HTTP response see HTTP in base  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>string</code> | not used. |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+screenshot"></a>

### framework.screenshot(x, cb) ⇒ <code>image</code>
take a screenshot from the framework

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>image</code> - image - Base64 encoded image  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>string</code> | not used. |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+getFPS"></a>

### framework.getFPS(x, cb) ⇒ <code>int</code>
gets the FPS from the Webkit plugin

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>int</code> - FPS - Current FPS  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>string</code> | not used. |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+getCpuLoad"></a>

### framework.getCpuLoad(x, cb) ⇒ <code>float</code>
get the CPU load from deviceinfo

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>float</code> - CPU Load  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>string</code> | not used. |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+getMemoryUsage"></a>

### framework.getMemoryUsage(x, cb) ⇒ <code>integer</code>
get system memory usage

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>integer</code> - Memory usage of the device  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>string</code> | not used. |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+getMemoryUsageForPlugin"></a>

### framework.getMemoryUsageForPlugin(requestedPlugin, cb) ⇒ <code>object</code>
get memory usage from monitor. Note this only applies to plugins that are monitored by the Monitor plugin

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>object</code> - Plugin object from monitor plugin  

| Param | Type | Description |
| --- | --- | --- |
| requestedPlugin | <code>string</code> | Callsign of the plugin that is being monitored by the monitor. |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+startFramework"></a>

### framework.startFramework()
start Framework in background mode - FIXME needs to be revised in the webbased version.

**Kind**: instance method of [<code>Framework</code>](#Framework)  
<a name="Framework+stopFramework"></a>

### framework.stopFramework()
stop Framework - FIXME needs to be revised in the webbased version.

**Kind**: instance method of [<code>Framework</code>](#Framework)  
<a name="Framework+killFramework"></a>

### framework.killFramework()
kill (SIGTERM) Framework - FIXME needs to be revised in the webbased version.

**Kind**: instance method of [<code>Framework</code>](#Framework)  
<a name="Framework+killallFramework"></a>

### framework.killallFramework()
kill Framework and its WPEProcess subprocesses - FIXME needs to be revised in the webbased version.

**Kind**: instance method of [<code>Framework</code>](#Framework)  
<a name="Framework+restartFramework"></a>

### framework.restartFramework()
restart the Framework - FIXME needs to be revised in the webbased version.

**Kind**: instance method of [<code>Framework</code>](#Framework)  
<a name="Framework+requestProvisioning"></a>

### framework.requestProvisioning(x, cb) ⇒ <code>object</code>
request new provisioning details to the provisioning plugin

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>object</code> - HTTP response see HTTP in base  

| Param | Type | Description |
| --- | --- | --- |
| x | <code>string</code> | not used. |
| cb | <code>function</code> | Callback function to be called |

<a name="Framework+checkResumedOrActivated"></a>

### framework.checkResumedOrActivated(state) ⇒ <code>boolean</code>
check if plugin is resumed or activated

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>boolean</code> - True if resumed or activated, throws error if not  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>string</code> | of the plugin |

<a name="Framework+checkSuspendedOrDeactivated"></a>

### framework.checkSuspendedOrDeactivated(state) ⇒ <code>boolean</code>
check if plugin is suspended or deactivated

**Kind**: instance method of [<code>Framework</code>](#Framework)  
**Returns**: <code>boolean</code> - True if suspended or deactivated, throws error if not  

| Param | Type | Description |
| --- | --- | --- |
| state | <code>string</code> | of the plugin |

