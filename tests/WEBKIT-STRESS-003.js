/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

const fs = require('fs');
const url = require('url');

module.exports = {
    'title'         : 'WPEWebkit stability redirect test',
    'description'   : 'Stress loads the system with redirects and see if the WPEWebkit process continues to operate nominally',
    'port'          : undefined,
    'server'        : undefined,
    'app'           : undefined,
    'appRequested'  : false,
    'timedout'      : false,
    'timer'         : undefined,
    'extends'       : 'WEBKIT-STRESS-001.js',
    'steps'         : {
        'init1' : {
            'description'   : 'Load resources to start the test',
            'test'          : function(x, callback) {
                readApp((err, app) => {
                    if (err || app === undefined) 
                        callback(false);

                    task.app = '' + app;
                    callback(true);
                });
            },
        },
        'init8' : {
            'sleep'         : 10,
            'description'   : 'Check if app is loaded on WPEWebkit',
            'test'          : getUrl,
            'validate'      : (resp) => {
                var parsedUrl = url.parse(resp, false);
                if (parsedUrl.host === `${task.server}:${task.port}` && task.appRequested === true)
                    return true;
                
                throw new Error('URL did not load on WPEWebkit');
            }
        },
    }
};


function readApp(callback){
    fs.readFile('./tests/resources/redir_app.html', function(err, data){
        if (err){
            throw err;
        } else {
            callback(undefined, data);
        }
    });
}
