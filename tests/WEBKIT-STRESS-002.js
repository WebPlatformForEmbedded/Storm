/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

const fs = require('fs');
const url = require('url');

module.exports = {
    'title'         : 'WPEWebkit stability images test',
    'description'   : 'Stress loads the system with images and see if the WPEWebkit process continues to operate nominally',
    'port'          : null,
    'server'        : null,
    'image'         : null,
    'app'           : null,
    'appRequested'  : false,
    'imageRequested': false,
    'notFoundReq'   : false,
    'extends'       : 'WEBKIT-STRESS-001.js',
    'steps'         : {
        'init1' : {
            'description'   : 'Load resources to start the test',
            'test'          : function(x, callback) {
                readApp((err, app) => {
                    if (err || app === undefined) 
                        callback(false);

                    task.app = '' + app;
                    readImage((err, image) => {
                        if (err || image === undefined) 
                            callback(false);                        

                        task.image = image;
                        callback(true);
                    });
                });
            },
            'assert'        : true

        },
        'init2' : {
            'description'   : 'Start the HTTP server, serve the images app',
            'timeout'       : 180, //seconds
            'test'          : startHttpServer,
            'params'        : function (request, response) {

                var parsedUrl = url.parse(request.url, false);

                function returnApp(){
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    response.end(task.app);
                    task.appRequested = true;
                }

                function returnImage(){
                    response.writeHead(200, 
                        {'Content-Type': 'image/png; charset=utf-8'},
                        {'Content-Length': 12388}
                    );
                    response.write(task.image);
                    response.end();
                    task.imageRequested = true;
                }

                if (parsedUrl.pathname == '/app'){
                    returnApp();
                } else if (parsedUrl.pathname.slice(0,11) == '/images.png') {
                    returnImage();
                } else {
                    response.writeHead(404, {'Content-Type': 'text/html'});
                    response.end('Not found');
                    task.notFoundReq = true;
                }

            },
            'validate'      : (port) => {
                if (port === null || port === undefined)
                    return false;

                task.port = port;
                return true;
            }
        },
        'step1' : {
            'description'   : 'Reset checks and check if image requests are still being made',
            'test'          : (x, cb) => {
                task.imageRequested = false;
                task.notFoundReq = false;
                setTimeout(cb, 10 * 1000, true);
            },
            'validate'      : () => {
                if (task.imageRequested === true && task.notFoundReq === false)
                    return true;
                
                throw new Error('Images are no longer being requested or not found error has occured');
            }
        }
    }
};


function readApp(callback){
    fs.readFile('./tests/resources/images_app.html', function(err, data){
        if (err){
            throw err;
        } else {
            callback(undefined, data);
        }
    });
}

function readImage(callback){
    fs.readFile('./tests/resources/images.png', function(err, data){
        if (err){
            throw err;
        } else {
            callback(undefined, data);
        }
    });
}
