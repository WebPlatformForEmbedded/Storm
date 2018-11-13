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
    wtf = {};

    // Routes
    var routes = {};

    // private
    let bootStep        = 0;
    let hostname;
    let port;
    let views           = {};
    let options         = {};

    /**
    * Main initialization function
    *
    * Goes through a series of bootSteps to initialize the application, each step calls init again
    * Within the init a loadingPage is rendered to show progress of the boot
    * @memberof application
    */

    var bootSequence = {

        'gethostport' : function(cb) {
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


            cb(500);
        },

        getoptionsfromurl : function(cb) {
            /*
             * Get options from url string to be used in the app
             */
            if (window.location.search.split('?').length > 1) {
                let searchOptions = window.location.search.split('?')[1].split('&');

                for ( var i=0; i<searchOptions.length; i++ ) {
                    let split = searchOptions[i].split('=');
                    options[ split[0] ] = split[1];
                }
            }

            cb();
        },

        'loadcore' : function(cb) {
            /*
             * Load core plugin for main framework execution
             */

             if (window.classes == undefined || window.classes.Core === undefined) {
                cb(null, 2000);
                return;
            }

            wtf = new window.classes.Core();
            mergeObjects(window, wtf);
            cb();

        },

        'loadplugins' : function(cb) {
            /*
             * Load base & framework plugin for basic communication with WPE Framework
             */
            console.debug('Load base & framework plugin');

            // we're loading in debug, retry in a few ms it takes a bit to load the seperate plugins
            if (window.plugins == undefined || window.plugins.Framework === undefined || window.plugins.Base === undefined) {
                cb(null, 2000);
                return;
            }

            let plugins = new window.plugins.Framework();

            // this is required because non of the functions in the tests are pre-fixed, so all has to be global
            mergeObjects(window, plugins);

            cb();
        },

        'loadtests' : function(cb) {
            /*
             * Load the tests
             */

            console.debug('Loading tests manifest');

            get('js/tests.json', (resp) => {
                if (resp.error !== undefined)
                    console.error('Error loading tests.json from server, no tests are available');

                if (resp.status === 200 && resp.body !== undefined) {
                    wtf.tests = JSON.parse(resp.body);
                    console.log(`Loaded ${Object.keys(wtf.tests).length} tests`);
                }

                cb();
            });
        },

        'loadviews' : function(cb) {
            /*
             * Load views
             */

            console.log('Loading views');

            if (window.views === undefined || window.views.Menu === undefined || window.views.Device === undefined) {
                cb(null, 1000);
                return;
            }

            // load views dynamically
            let viewClasses = Object.keys(window.views);

            for (var i=0; i<viewClasses.length; i++) {
                let _viewName = viewClasses[i];
                let _view = window.views[  _viewName ];

                views[ _viewName ] = new _view();
            }

            cb();
        },

        'loadrouter' : function(cb) {
            /*
             * Init routing and load view
             */

            routes = {
                'device'           : views.Device,
                'tests'            : views.Tests,
                'test'             : views.Test,
            };

            // check if we're running in dummy more, this enable dummy tests that are used to verify the wpetest framework
            if (options.dummy !== undefined) {
                console.debug('Test mode enabled.');
                wtf.dummyMode = true;
            }

            // auto onboard if host is provided in the url and nothing is activated already
            if (options.host !== undefined && options.host !== '' && wtf.getHost() === null) {
                wtf.activateDevice(options.host, () => {
                    cb(null, 100);
                });

                // make sure we only render the view once the device is onboarded, bail out here
                return;
            }

            // check if our route resolves else load landing
            let hash = window.location.hash.replace('#', '');
            if (hash !== undefined && routes[ hash ] !== undefined) {
                routes[ hash ].render();
            } else {
                // no route found, go to device onboarding page.
                views.Device.render();
            }

            cb();
        }
    };

    function init(){
        var initFunctionList = Object.keys(bootSequence);

        // check if we are done
        if (bootStep > initFunctionList.length-1)
            return;


        // else start the boot function
        bootSequence[ initFunctionList[ bootStep ] ]( (delayInMs, retryInMs) => {
            if (delayInMs === null && retryInMs !== undefined) {
                console.debug(`Retrying bootstep ${bootStep} in ${delayInMs} ms`);
                setTimeout(init, retryInMs);
            }

            else if (delayInMs !== undefined) {
                console.debug(`Bootstep ${bootStep} completed, starting next in ${delayInMs} ms`);
                bootStep++;
                setTimeout(init, delayInMs);
            }

            else {
                console.debug(`Bootstep ${bootStep} completed, starting next`);
                bootStep++;
                init();
            }

        });
    }

    function mergeObjects(a, b){
        for (var attrname in b) {
            //console.log('Merging: ' + attrname);
            a[attrname] = b[attrname];
        }
    }

    /** (global) navigate to other screen */
    navigate = function(name, options) {
        routes[ name ].render(options);
        window.location.hash = name;
    };

    setOption = function(newOption) {
        // add new option
        let newOptionKey = Object.keys(newOption);
        options[ newOptionKey ] = newOption[ newOptionKey ];


        // construct string and append to the current window location
        let searchStr = '';
        let optionList = Object.keys(options);

        if (optionList.length > 0)
            searchStr += '?';

        for (var i=0; i<optionList.length; i++) {
            if (options[ optionList[i] ] === undefined)
                continue;

            if (searchStr !== '?')
                searchStr += '&';

            searchStr += `${optionList[i]}=${options[ optionList[i] ]}`;
        }

        window.location.search = searchStr;
    };

    init();

})();
