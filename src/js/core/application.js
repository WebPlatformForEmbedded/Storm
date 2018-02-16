/**
 * WPE Test Framework application.js
 *
 * Main WTF UI application - initializes and starts the UI (short: WTFUI)
 * The landing page can be configured in conf.js
 */

(function () {
    /**
    * Create the initial structure & globals
    */

    // public
    plugins             = {};           // plugins

    // private
    var bootStep        = 1;
    var fetchedPlugins  = [];
    var mainDiv         = document.getElementById('main');
    var activeView      = undefined;

    // TODO add a router, like minirouter


    /**
    * Main initialization function
    *
    * Goes through a series of bootSteps to initialize the application, each step calls init again
    * Within the init a loadingPage is rendered to show progress of the boot
    * @memberof application
    */
    function init(){
        if (bootStep === 1){
            /*
             * BOOT Step 1 - Init the WPE API
             */
            console.debug('Initializing WPE API');
            var hostname = document.getElementById("hostname") && document.getElementById("hostname").value;
            if ((hostname === null) || (hostname === ""))
                hostname = window.location.hostname;

            port = document.getElementById("port") && document.getElementById("port").value;
            if ((port === null) || (port === "")) {
                if (window.location.host === window.location.hostname)
                    port = 80;
                else
                    port = window.location.host.substring(window.location.hostname.length + 1);
            }

            if ((port !== "") && (port !== 80))
                hostname += ":" + port;

            // check if wpe.js is already loaded, if not wait
            if (window.WpeApi === undefined) {
                console.debug('WPE API is not ready yet, retrying...');
                setTimeout(init, 1000);
                return;
            }

            // initialize the WPE Framework API
            api = new window.WpeApi(hostname);
            initNext();
        }
    }

    /** Find the next bootstep and go run that */
    function initNext() {
        console.debug('Bootstep ' + bootStep + ' completed');

        bootStep++;
        init();
    }

    /** (global) renders a plugin in the main div */
    showPlugin = function(callsign) {
        if (plugins[ callsign ] === undefined)
            return;

        if (activePlugin !== undefined && plugins[ activePlugin ] !== undefined)
            plugins[ activePlugin ].close();

        document.getElementById('main').innerHTML = '';
        plugins[ callsign ].render();
        activePlugin = callsign;
    };

    /** (global) refresh current active plugin */
    renderCurrentPlugin = function() {
        document.getElementById('main').innerHTML = '';
        plugins[ activePlugin ].render();
    };

    init();

})();
