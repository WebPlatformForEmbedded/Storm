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

