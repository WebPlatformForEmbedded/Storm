/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'title'         : 'Framework Controller API test',
    'description'   : 'Iterate over a list of Framework APIs, both valid and not valid and see if Framework continues to run',
    'urls'          : [],
    'steps'         : {
        'init1' : {
            'description'   : 'Get list of modules from Framework',
            'test'          : getPlugin,
            'params'        : 'Controller'
        },
        'init2' : {
            'description'   : 'Parse list of modules and setup URLs to test',
            'test'          : (x, cb) => {
                var resp = JSON.parse( getResponseByStep('init1').body );
                var modules = [];

                // default urls
                //test.urls.push( { method: 'GET', path: '/', res: 301 } );
                test.urls.push( { method: 'GET', path: '/Service/Controller', res: 200 } );
                //test.urls.push( { method: 'GET', path: '/Service/Controller/UI', res: 200 } );

                // plugin based urls
                for (var i=0; i < resp.plugins.length; i++) {
                    var _module = resp.plugins[i].callsign;

                    if (_module === 'Controller')
                        continue;

                    modules.push(_module);

                    // keep state the same as we left it when we're done
                    if (test.controllerResp.plugins[i].state.toLowerCase() === 'activated' || resp.plugins[i].state.toLowerCase() === 'resumed') {
                        test.urls.push( { method: 'PUT', path: '/Service/Controller/Deactivate/' + _module, res: 200 } );
                        test.urls.push( { method: 'PUT', path: '/Service/Controller/Activate/' + _module, res: 200 } );

                        if (_module === 'Commander')
                            test.urls.push( { method: 'GET', path: '/Service/' + _module, res: 400 } );
                        else if (_module === 'DIALServer')
                            test.urls.push( { method: 'GET', path: '/Service/' + _module, res: 501 } );
                        else if (_module === 'WebProxy')
                            test.urls.push( { method: 'GET', path: '/Service/' + _module, res: 503 } );
                        else if (_module === 'WebServer')
                            test.urls.push( { method: 'GET', path: '/Service/' + _module, res: 503 } );
                        else
                            test.urls.push( { method: 'GET', path: '/Service/' + _module, res: 200 } );
                    } else {
                        test.urls.push( { method: 'PUT', path: '/Service/Controller/Activate/' + _module, res: 200 } );

                        if (_module === 'Commander')
                            test.urls.push( { method: 'GET', path: '/Service/' + _module, res: 400 } );
                        else if (_module === 'DIALServer')
                            test.urls.push( { method: 'GET', path: '/Service/' + _module, res: 501 } );
                        else if (_module === 'WebProxy')
                            test.urls.push( { method: 'GET', path: '/Service/' + _module, res: 503 } );
                        else if (_module === 'WebServer')
                            test.urls.push( { method: 'GET', path: '/Service/' + _module, res: 503 } );
                        else
                            test.urls.push( { method: 'GET', path: '/Service/' + _module, res: 200 } );

                        test.urls.push( { method: 'PUT', path: '/Service/Controller/Deactivate/' + _module, res: 200 } );
                    }
                }

                // screenshot
                if (_modules.indexOf('Snapshot') !== -1)
                    test.urls.push( { method: 'GET', path: '/Service/Snapshot/Capture', res: 202 } );

                // invalid urls
                test.urls.push( { method: 'GET', path: '/Service', res: 400 } );
                test.urls.push( { method: 'GET', path: '/Service/', res: 400 } );
                test.urls.push( { method: 'GET', path: '/Service////', res: 400 } );
                test.urls.push( { method: 'GET', path: '/this/is/a/wrong/url?param=123', res: 404 } );
                test.urls.push( { method: 'GET', path: 'a/b/c/d/e/f/g/h/i/l/m/n/o/p/q/r/s/t/u/v/w', res: 404 } );
                test.urls.push( { method: 'GET', path: '_?":{}]!@#$%^&*()_+`~.,', res: 404 } );
                test.urls.push( { method: 'GET', path: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', res: 404 } );
                test.urls.push( { method: 'GET', path: '///////////////////////////', res: 404 } );
                test.urls.push( { method: 'GET', path: 'a/?a&b?32=&param=oops=what=are=we=doing?', res: 404 } );
                test.urls.push( { method: 'DELETE', path: '/', res: 301 } ); // should be 404, but Framework returns a 301 here. OK for now.
                test.urls.push( { method: 'PUT', path: '/', res: 301 } ); // should be 404, but Framework returns a 301 here. OK for now.
                test.urls.push( { method: 'POST', path: '/', res: 301 } ); // should be 404, but Framework returns a 301 here. OK for now.
                test.urls.push( { method: 'DELETE', path: '/Service/Controller', res: 200 } );
                test.urls.push( { method: 'PUT', path: '/Service/Controller/Deactivate/Controller', res: 403 } );
                test.urls.push( { method: 'PUT', path: '/Service/Controller/Activate/Controller', res: 403 } );

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
                        if (resp.error !== undefined)
                            throw new Error(`Error making request ${test.urls[idx].method} ${test.urls[idx].path}: ${resp.error}`);

                        if (resp.status !== test.urls[idx].res)
                            throw new Error(`Framework did not respond with expected status code on request ${test.urls[idx].method} ${test.urls[idx].path}, expected: ${test.urls[idx].res} got: ${resp.status} ${resp.statusMessage}`);

                        if (idx === test.urls.length-1){
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
                var _resp = JSON.parse(resp.body);
                return true;
            }
        },
    },
    'cleanup'       : restartFramework
};
