/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'         : 'Validate cache headers on all plugins',
    'description'   : 'Iterate over all plugins and verify their cache headers when deactivated',
    'controllerResp': undefined,
    'urls'          : [],
    'steps'         : {
        'init1' : {
            'description'   : 'Get list of modules from Framework',
            'test'          : getPlugin,
            'params'        : 'Controller',
            'validate'      : (resp) => {
                test.controllerResp = JSON.parse(resp.body);
                return true;
            }
        },
        'init2' : {
            'description'   : 'Parse list of modules and setup URLs to test',
            'test'          : (x, cb) => {
                var modules = [];
                test.urls.push( { method: 'GET', path: '/Service/Controller'} );
                // plugin based urls
                for (var i=0; i < test.controllerResp.plugins.length; i++) {
                    var module = test.controllerResp.plugins[i].callsign;
                    console.log(module);
                    if (module === 'Controller')
                        continue;

                    // keep state the same as we left it when we're done
                    if (test.controllerResp.plugins[i].state.toLowerCase() === 'activated' || test.controllerResp.plugins[i].state.toLowerCase() === 'resumed') {
                        if (module === 'WebServer' || module === 'WebProxy') {
                            test.urls.push( { method: 'PUT', path: `/Service/Controller/Deactivate/${module}`} )
                            test.urls.push( {method: 'GET', path: `/Service/Controller/${module}`} )
                        } else {
                            test.urls.push( { method: 'PUT', path: `/Service/Controller/Deactivate/${module}`} )
                            test.urls.push( {method: 'GET', path: `/Service/${module}`} )
                        }
                    } else {
                        test.urls.push( {method: 'GET', path: `/Service/${module}`} )
                    }
                }

                setTimeout(cb, 2000, test.urls);
            }
        },
        'step1' : {
            'description'   : 'Call all URLs in generated list',
            'timeout'       : 15 * 60,
            'test'          : function (x, cb) {
                var idx = 0;

                function makeRequest() {
                    var opts = {
                        url     : `http://${host}:80${test.urls[idx].path}`,
                        method  : test.urls[idx].method
                    };

                    console.log('Calling Framework with opts: ', opts);

                    http(opts, (resp) => {
                        var headerObj = resp.headers;
                        // console.log(headerObj);
                        console.log(headerObj['cache-control']);

                        if (headerObj['cache-control'] === undefined)
                            throw new Error(`Error making request ${test.urls[idx].method} ${test.urls[idx].path}: ${resp.error}`);

                        if (idx === test.urls.length-1){
                            cb(); // we're done.
                        } else {
                            idx++;
                            setTimeout(makeRequest, 2000);
                        }
                    });
                }

                makeRequest();
            }
        },
        'step2' : {
            'description'   : 'Activate all plugins at the end of the test',
            'test'          : restartFramework,
        },
    },
    'cleanup'       : restartFramework
};
