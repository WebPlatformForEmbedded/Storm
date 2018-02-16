/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'         : 'Validate cache headers on all plugins',
    'description'   : 'Iterate over all plugins and verify their cache headers when activated',
    'controllerResp': undefined,
    'urls'          : [],
    'steps'         : {
        'init1' : {
            'description'   : 'Get list of modules from Framework',
            'test'          : getPlugin,
            'params'        : 'Controller',
            'validate'      : (resp) => {
                task.controllerResp = JSON.parse(resp.body);
                return true;
            }
        },
        'init2' : {
            'description'   : 'Parse list of modules and setup URLs to test',
            'test'          : (x, cb) => {
                var modules = [];
                task.urls.push( { method: 'GET', path: '/Service/Controller'} );
                // plugin based urls
                for (var i=0; i < task.controllerResp.plugins.length; i++) {
                    var module = task.controllerResp.plugins[i].callsign;
                    console.log(module);
                    if (module === 'Controller')
                        continue;

                    // keep state the same as we left it when we're done
                    if (task.controllerResp.plugins[i].state.toLowerCase() === 'activated' || task.controllerResp.plugins[i].state.toLowerCase() === 'resumed') {
                        if (module === 'WebServer' || module === 'WebProxy') {
                            task.urls.push( {method: 'GET', path: `/Service/Controller/${module}`} )
                        } else {
                            task.urls.push( {method: 'GET', path: `/Service/${module}`} )
                        }
                    } else {
                        task.urls.push( { method: 'PUT', path: `/Service/Controller/Activate/${module}`} );
                        task.urls.push( {method: 'GET', path: `/Service/${module}`} )

                    }
                }

                setTimeout(cb, 2000, task.urls);
            }
        },
        'step1' : {
            'description'   : 'Call all URLs in generated list',
            'timeout'       : 15 * 60,
            'test'          : function (x, cb) {
                var idx = 0;

                function makeRequest() {
                    var opts = {
                        url     : `http://${host}:80${task.urls[idx].path}`,
                        method  : task.urls[idx].method
                    };

                    console.log('Calling Framework with opts: ', opts);

                    http(opts, (resp) => {
                        var headerObj = resp.headers;
                        console.log(headerObj['cache-control']);
                        console.log(headerObj['access-control-allow-origin']);
                        // console.log(headerObj);

                        if (headerObj['cache-control'] === undefined && headerObj['access-control-allow-origin'] === undefined)
                            throw new Error(`Error making request ${task.urls[idx].method} ${task.urls[idx].path}: ${resp.error}`);

                        if (idx === task.urls.length-1){
                            cb(); // we're done.
                        } else {
                            idx++;
                            setTimeout(makeRequest, 2000);
                        }
                    });
                }

                makeRequest();
            }
        }
    },
    'cleanup'       : restartFramework
};
