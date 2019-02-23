/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'operator'          : 'cwc',
    'title'             : 'CWC Johnny Random',
    'description'       : 'Heres Johnny! Random keys will be sent.',
    'requiredPlugins'   : ['WebKitBrowser'],
    'timeInBetweenKeys' : 2, // 5s inbetween keys
    'maxRandomKeys'     : 10,
    'timeout'           : 12600, //s == 3.5 hour
    'sendCustomKey'     : (key, cb) => {
        /* From homecast.json keymap:
            { "code": "0x0030", "key": 11,  "char": "0" },
            { "code": "0x0031", "key": 2,  "char": "1" },
            { "code": "0x0032", "key": 3,  "char": "2" },
            { "code": "0x0033", "key": 4,  "char": "3" },
            { "code": "0x0034", "key": 5,  "char": "4" },
            { "code": "0x0035", "key": 6,  "char": "5" },
            { "code": "0x0036", "key": 7,  "char": "6" },
            { "code": "0x0037", "key": 8,  "char": "7" },
            { "code": "0x0038", "key": 9,  "char": "8" },
            { "code": "0x0039", "key": 10,  "char": "9" },
            { "code": "0xE041", "key": 103,  "char": "Up" },
            { "code": "0xE042", "key": 108,  "char": "Down" },
            { "code": "0xE020", "key": 28,  "char": "Enter" },
            { "code": "0xE044", "key": 105,  "char": "Left" },
            { "code": "0xE043", "key": 106,  "char": "Right" },
            { "code": "0xE05B", "key": 14,  "char": "Exit (mapped to backspace)" },
            { "code": "0xE0E9", "key": 164, "char": "Play/Pause" },
            { "code": "0xE06A", "key": 168, "char": "Rewind"},
            { "code": "0xE06C", "key": 208, "char": "Fastforward"},
            { "code": "0xE071", "key": 128, "char": "Stop"},
        */
        var customKeys = {
            'ok'            : '0xE020',
            'up'            : '0xE041',
            'down'          : '0xE042',
            'left'          : '0xE044',
            'right'         : '0xE043',
            'exit'          : '0xE05B',
            'play'          : '0xE0E9',
            'rewind'        : '0xE06A',
            'ffwd'          : '0xE06C',
            'stop'          : '0xE071',
        };

        function _keyPress(key, cb) {
            var data = JSON.stringify({ 'code' : key });
            var opts = {
                url     : `http://${host}:80/Service/RemoteControl/keymap/Press`,
                body    : data,
                method  : 'PUT',
            };
            http(opts, cb);
        }

        function _keyRelease(key, cb) {
            var data = JSON.stringify({ 'code' : key });
            var opts = {
                url     : `http://${host}:80/Service/RemoteControl/keymap/Release`,
                body    : data,
                method  : 'PUT',
            };
            http(opts, cb);
        }

        _keyPress(customKeys[ key ], () => {
            _keyRelease(customKeys[ key ], cb);
        });
    },
    'steps'         : {
        'step1' : {
            'description'   : 'Check if WebKit is running',
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'assert'        : 'resumed'
        },
        'step2' : {
            'description'   : 'Send random keys',
            'test'          : (cb) => {
                var customKeys = {
                    'ok'            : '0xE020',
                    'up'            : '0xE041',
                    'down'          : '0xE042',
                    'left'          : '0xE044',
                    'right'         : '0xE043',
                    'exit'          : '0xE05B',
                    'play'          : '0xE0E9',
                    'rewind'        : '0xE06A',
                    'ffwd'          : '0xE06C',
                    'stop'          : '0xE071',
                };

                var keys = Object.keys(customKeys);
                var keyQueue = [];
                var copyOfKeyQueue = [];

                for (var i=0; i<test.maxRandomKeys; i++){
                    var idx = Math.floor(Math.random() * (keys.length));
                    keyQueue.push( keys[idx] );
                    copyOfKeyQueue.push( keys[idx] );
                }

                function sendKey() {
                    var k = keyQueue.shift();
                    console.log('Sending: ' + k);
                    test.sendCustomKey(k, (resp) => {
                        if (keyQueue.length !== 0)
                            setTimeout(sendKey, 1000);
                        else
                            cb(copyOfKeyQueue);
                    });
                }

                sendKey();
            }
        },
        'repeatStep' : {
            'description'   : 'Repeat for 1 hour',
            'goto'          : 'step1',
            'repeatTime'    : 1 * 60,
        }
    }
};
