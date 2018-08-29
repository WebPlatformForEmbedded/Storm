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

    // main API
    var wtf             = {};
    var tests;

    // private
    let bootStep        = 1;
    let hostname;
    let port;
    let views           = {};

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
             * BOOT Step 1 - Get current hostname / port
             */
            console.debug('Get current hostname + port');
            hostname = document.getElementById("hostname") && document.getElementById("hostname").value;
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


            initNext();
        }

        if (bootStep === 2) {
            /*
             * Init the core
             */
            console.debug('Loading WTF core');

            // we're loading in debug, retry in a few ms it takes a bit to load the seperate plugins
            if (window.classes == undefined || window.classes.Core === undefined) {
                setTimeout(init, 1000);
                return;
            }

            core = new window.classes.Core();
            mergeObjects(wtf, core);

            initNext();
        }


        if (bootStep === 3){
            /*
             * Load base & framework plugin for basic communication with WPE Framework
             */
            console.debug('Load base & framework plugin');

            // we're loading in debug, retry in a few ms it takes a bit to load the seperate plugins
            if (window.plugins == undefined || window.plugins.Base === undefined || window.plugins.Framework === undefined) {
                setTimeout(init, 1000);
                return;
            }

            var base = new window.plugins.Base();
            mergeObjects(wtf, base);
            var framework = new window.plugins.Framework();
            mergeObjects(wtf, framework);

            initNext();
        }

        if (bootStep === 4) {
            /*
             * Load the tests
             */

            console.debug('Loading tests manifest');

            wtf.get('js/tests.json', (resp) => {
                if (resp.error !== undefined)
                    console.error('Error loading tests.json from server, no tests are available');

                if (resp.status === 200 && resp.body !== undefined) {
                    tests = JSON.parse(resp.body);
                    console.log(`Loaded ${tests.length} tests`);
                }
            });

            initNext();
        }        

        if (bootStep === 5){
            /*
             * Load views
             */

            console.log('Loading views');

            if (window.views === undefined || window.views.Menu === undefined || window.views.Landing === undefined) {
                setTimeout(init, 1000);
                return;
            }

            views.menu = new window.views.Menu();
            views.landing = new window.views.Landing(tests);
            initNext();

        }

        if (bootStep === 6){
            /*
             * Init routing and load view
             */

            // Source, see https://github.com/flatiron/director
            var routes = {
                '/home' : views.landing.render
            };

            var router = Router(routes);
            router.init();
            router.setRoute('/home');

            // set router at menu so menu can use it
            views.menu.router = router;
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

    function mergeObjects(a, b){
        for (var attrname in b) {
            console.log('Merging: ' + attrname);
            a[attrname] = b[attrname];
        }
    }

    init();

})();
