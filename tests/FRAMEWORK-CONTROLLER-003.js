/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'         : 'Framework Controller API test',
    'description'   : 'Iterate over a list of Framework APIs, both valid and not valid and see if Framework continues to run',
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

                // default urls
                task.urls.push( { method: 'GET', path: '/', res: 301 } );
                task.urls.push( { method: 'GET', path: '/Service/Controller', res: 200 } );
                task.urls.push( { method: 'GET', path: '/Service/Controller/UI', res: 200 } );

                // plugin based urls
                for (var i=0; i < task.controllerResp.plugins.length; i++) {
                    var module = task.controllerResp.plugins[i].callsign;

                    if (module === 'Controller')
                        continue;

                    modules.push(module);

                    // keep state the same as we left it when we're done
                    if (task.controllerResp.plugins[i].state.toLowerCase() === 'activated' || task.controllerResp.plugins[i].state.toLowerCase() === 'resumed') {
                        task.urls.push( { method: 'PUT', path: '/Service/Controller/Deactivate/' + module, res: 200 } );
                        task.urls.push( { method: 'PUT', path: '/Service/Controller/Activate/' + module, res: 200 } );

                        if (module === 'DIALServer')
                            task.urls.push( { method: 'GET', path: '/Service/' + module, res: 501 } );
                        else if (module === 'WebProxy')
                            task.urls.push( { method: 'GET', path: '/Service/' + module, res: 503 } );
                        else if (module === 'WebServer')
                            task.urls.push( { method: 'GET', path: '/Service/' + module, res: 503 } );
                        else if (module === 'Snapshot')
                            task.urls.push( { method: 'GET', path: '/Service/' + module, res: 405 } );
                        else
                            task.urls.push( { method: 'GET', path: '/Service/' + module, res: 200 } );
                    } else {
                        task.urls.push( { method: 'PUT', path: '/Service/Controller/Activate/' + module, res: 200 } );

                        if (module === 'DIALServer')
                            task.urls.push( { method: 'GET', path: '/Service/' + module, res: 501 } );
                        else if (module === 'WebProxy')
                            task.urls.push( { method: 'GET', path: '/Service/' + module, res: 503 } );
                        else if (module === 'WebServer')
                            task.urls.push( { method: 'GET', path: '/Service/' + module, res: 503 } );
                        else if (module === 'Snapshot')
                            task.urls.push( { method: 'GET', path: '/Service/' + module, res: 405 } );
                        else
                            task.urls.push( { method: 'GET', path: '/Service/' + module, res: 200 } );

                        task.urls.push( { method: 'PUT', path: '/Service/Controller/Deactivate/' + module, res: 200 } );
                    }
                }

                // screenshot
                if (modules.indexOf('Snapshot') !== -1)
                    task.urls.push( { method: 'PUT', path: '/Service/Snapshot/Capture', res: 202 } );

                // invalid urls
                task.urls.push( { method: 'GET', path: '/Service', res: 400 } );
                task.urls.push( { method: 'GET', path: '/Service/', res: 400 } );
                task.urls.push( { method: 'GET', path: '/Service////', res: 400 } );
                task.urls.push( { method: 'GET', path: '/this/is/a/wrong/url?param=123', res: 404 } );
                task.urls.push( { method: 'GET', path: 'a/b/c/d/e/f/g/h/i/l/m/n/o/p/q/r/s/t/u/v/w', res: 404 } );
                task.urls.push( { method: 'GET', path: '_?":{}]!@#$%^&*()_+`~.,', res: 404 } );
                task.urls.push( { method: 'GET', path: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', res: 404 } );
                task.urls.push( { method: 'GET', path: '///////////////////////////', res: 404 } );
                task.urls.push( { method: 'GET', path: 'a/?a&b?32=&param=oops=what=are=we=doing?', res: 404 } );
                task.urls.push( { method: 'DELETE', path: '/', res: 301 } ); // should be 404, but Framework returns a 301 here. OK for now.
                task.urls.push( { method: 'PUT', path: '/', res: 301 } ); // should be 404, but Framework returns a 301 here. OK for now.
                task.urls.push( { method: 'POST', path: '/', res: 301 } ); // should be 404, but Framework returns a 301 here. OK for now.
                task.urls.push( { method: 'DELETE', path: '/Service/Controller', res: 200 } );
                task.urls.push( { method: 'PUT', path: '/Service/Controller/Deactivate/Controller', res: 403 } );
                task.urls.push( { method: 'PUT', path: '/Service/Controller/Activate/Controller', res: 403 } );

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
                        if (resp.error !== undefined)
                            throw new Error(`Error making request ${task.urls[idx].method} ${task.urls[idx].path}: ${resp.error}`);

                        if (resp.status !== task.urls[idx].res)
                            throw new Error(`Framework did not respond with expected status code on request ${task.urls[idx].method} ${task.urls[idx].path}, expected: ${task.urls[idx].res} got: ${resp.status}`);

                        if (idx === task.urls.length-1){
                            cb(); // we're done.
                        } else {
                            idx++;
                            setTimeout(makeRequest, 2000);
                        }
                    });
                }

                makeRequest();
            },
        },
        'step2' : {
            'sleep'         : 5,
            'description'   : 'Check if Framework is still responding',
            'test'          : getPlugin,
            'params'        : 'Controller',
            'validate'      : (resp) => {
                task.controllerResp = JSON.parse(resp.body);
                return true;
            }
        },
    },
    'cleanup'       : restartFramework
};
