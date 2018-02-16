/** The base plugin class applies for all plugins. Each plugin must match the name as it is returned from the WPE Framework
 * The supports object toggles what the plugin supports for the main ui
 */

class BasePlugin {

    /** Constructor
     * @{param} Name of the plugin for display on the UI
     * @{param} Support object to indicate plugin capabilities for the UI. Such as suspend/resume, toggle visibility and whether or not the plugin renders
     */
    constructor(pluginData) {
        this.priority = 5; // 1 = high, 10 = low priority
        this.depends = [];
        this.name = 'BasePlugin';
    }
}
