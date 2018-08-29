/** The base plugin class applies for all plugins each plugin will be globally loaded as part of the task job
 * objects within these plugins (outside constructor) will be accessible for all tests that are executed in the task runner
 */

class BasePlugin {

    /** Constructor
     * @{param} Priority sets the loading priority to resolve dependencies inter-plugins, make sure if you are dependent on plugins that the current plugin has a higher priority
     */
    constructor(pluginData) {
        this.priority = 5; // 1 = high, 10 = low priority
    }
}
