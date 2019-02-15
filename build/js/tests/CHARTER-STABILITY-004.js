/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

test = {
    'operator'          : 'charter',
    'title'             : 'Charter Thumbnail Robert',
    'description'       : 'Perform a bunch of actions to get the thumbnails to fail',
    'requiredPlugins'   : ['UX', 'Snapshot'],
    'maxSameScreenshot' : 3, // amount of times its okay to have the same screenshot
    'curSameScreenshot' : 0, // counter
    'timeInBetweenKeys' : 5, // 5s inbetween keys
    'timeout'           : 12600, //s == 3.5 hour
    'prevScreenshot'    : undefined,
    'sendCharterKey'    : (key, cb) => {
        var charterKeys = {
            'ok'            : '0xE011',
            'up'            : '0x9034',
            'down'          : '0x8035',
            'left'          : '0x7036',
            'right'         : '0x6037',
            'exit'          : '0xD012',
            'backspace'     : '0xa051',
            'channeldown'   : '0x400C',            
            'channelup'     : '0x500B',
            'guide'         : '0xd030',
            'menu'          : '0x6019',
        }

        function _keyPress(key, cb) {
            var data = JSON.stringify({ 'code' : key });
            var opts = {
                url     : `http://${host}:80/Service/RemoteControl/IR/Press`,
                body    : data,
                method  : 'PUT',
            };
            http(opts, cb);
        }

        function _keyRelease(key, cb) {
            var data = JSON.stringify({ 'code' : key });
            var opts = {
                url     : `http://${host}:80/Service/RemoteControl/IR/Release`,
                body    : data,
                method  : 'PUT',
            };
            http(opts, cb);
        }

        _keyPress(charterKeys[ key ], () => {
            _keyRelease(charterKeys[ key ], cb);
        });      
    },
    'checkScreenShot'   : (res) => {
        // check if we got an empty response
        if (res !== undefined && res.length > 0) {
            if (test.previousSceenshot === undefined || test.previousSceenshot !== res) {
                // screen updated, save it and reset stuck counter
                test.previousSceenshot = res;
                test.curSameScreenshot = 0;
                return true;
            } else {
                // screen is stuck
                // check if we have reached the max threshold
                if (test.curSameScreenshot >= test.maxSameScreenshot)
                    throw new Error('Screen is stuck, new screenshot is the same as previous screenshot for ' + test.curSameScreenshot + ' times.');

                // update counter and go again
                test.curSameScreenshot++;
                return true;
            }
        } else {
            // empty response is an annoying bug in the Snapshot module. Trying to be a little more graceful about it by allowing Framework to return an empty screenshot from time to time
            if (test.curSameScreenshot >= test.maxSameScreenshot)
                throw new Error('Error screenshot returned is empty for ' + test.curSameScreenshot + ' times.');

            // update counter and go again
            test.curSameScreenshot++;
            return true;
        }
    },
    'steps'         : {
        'step1' : {
            'description'   : 'Check if UX is loaded succesfully',
            'test'          : getPluginState,
            'params'        : 'UX',
            'assert'        : 'resumed'
        },
        'step2' : {
            'description'   : 'Create inital screenshot',
            'test'          : screenshot,
            'validate'      : (res) => {
                test.previousSceenshot = res;
                test.curSameScreenshot = 0;
                return true;
            }
        },
        'step3' : {
            'description'   : 'Change channel',
            'test'          : (cb) => {
                var keyQueue = ['channelup', 'channelup', 'channelup', 'channelup', 'channelup', 'channelup', 'channelup'];

                self = this;
                function sendKey() {
                    var k = keyQueue.shift();
                    console.log('Sending: ' + k);
                    test.sendCharterKey(k, (resp) => {
                        if (keyQueue.length !== 0)
                            setTimeout(sendKey, test.timeInBetweenKeys * 1000);
                        else
                            cb(keyQueue);
                    });
                }

                sendKey();
            }
        },
        'step4' : {
            'sleep'         : 5,
            'description'   : 'Change channel with repeat',
            'test'          : (cb) => {
                function _keyPress(key, cb) {
                    var data = JSON.stringify({ 'code' : key });
                    var opts = {
                        url     : `http://${host}:80/Service/RemoteControl/IR/Press`,
                        body    : data,
                        method  : 'PUT',
                    };
                    http(opts, cb);
                }

                function _keyRelease(key, cb) {
                    var data = JSON.stringify({ 'code' : key });
                    var opts = {
                        url     : `http://${host}:80/Service/RemoteControl/IR/Release`,
                        body    : data,
                        method  : 'PUT',
                    };
                    http(opts, cb);
                }

                _keyPress('0x500B', () => {
                    setTimeout(_keyRelease, 7 * 1000, '0x500B', cb)
                });
            }
        },
        'step5' : {
            'sleep'         : 5,
            'description'   : 'Go to search',
            'test'          : (cb) => {
                var keyQueue = ['menu', 'up', 'ok', 'ok', 'right', 'ok', 'down', 'down', 'ok'];

                self = this;
                function sendKey() {
                    var k = keyQueue.shift();
                    console.log('Sending: ' + k);
                    test.sendCharterKey(k, (resp) => {
                        if (keyQueue.length !== 0)
                            setTimeout(sendKey, test.timeInBetweenKeys * 1000);
                        else
                            cb(keyQueue);
                    });
                }

                sendKey();
            }
        },
        'step6' : {
            'sleep'         : 10,
            'description'   : 'Check if screen changed',
            'test'          : screenshot,
            'validate'      : this.checkScreenShot,
        },        
        'step7' : {
            'description'   : 'Exit search',
            'test'          : (cb) => {
                test.sendCharterKey('exit', cb)
            }
        },
        'repeatStep' : {
            'description'   : 'Repeat for 1 hour',
            'goto'          : 'step3',
            'repeatTime'    : 1 * 60,
        }
    }
};
