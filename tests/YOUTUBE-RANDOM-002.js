/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'             : 'YouTube Random Key test',
    'description'       : 'Send random keys to youtube, only to navigate the the UI. No enter is send so the device will never start playback',
    'requiredPlugins'   : ['WebKitBrowser'],
    'maxSameScreenshot' : 5, // amount of times its okay to have the same screenshot
    'curSameScreenshot' : 0, // counter
    'prevScreenshot'    : undefined,
    'steps'         : {
        'init0'  : {
            'description'   : 'Check if YouTube Plugin is present',
            'test'          : getPlugin,
            'params'        : 'YouTube',
            'validate'      : (resp) => {
                if (resp.status !== 400)
                    return true;

                NotApplicable('Build does not support YouTube');
            }
        },
        'step1' : {
            'description'   : 'Stop WPEWebkit',
            'test'          : stopPlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple,
        },
        'step2' : {
            'sleep'         : 30,
            'description'   : 'Check if WPEWebkit is stopped succesfully',
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'assert'        : 'deactivated'
        },
        'step3' : {
            'description'   : 'Start WPEWebkit',
            'test'          : startAndResumePlugin,
            'params'        : 'WebKitBrowser',
            'validate'      : httpResponseSimple,
        },
        'step4' : {
            'sleep'         : 30,
            'description'   : 'Check if WPEWebkit is started succesfully',
            'test'          : getPluginState,
            'params'        : 'WebKitBrowser',
            'validate'      : checkResumedOrActivated
        },
        'step5' : {
            'description'   : 'Set YouTube URL',
            'test'          : setUrl,
            'params'        : 'https://www.youtube.com/tv',
            'validate'      : httpResponseSimple,
        },
        'step6' : {
            'sleep'         : 10,
            'description'   : 'Check if the URL is loaded correctly',
            'test'          : getUrl,
            'assert'        : 'https://www.youtube.com/tv'
        },
        'step7' : {
            'sleep'         : 30,
            'description'   : 'Send 5 random keys',
            'test'          : (cb) => {
                var keys = [up, down, left, right, esc];
                var keyQueue = [];
                var copyOfKeyQueue = [];

                for (var i=0; i<5; i++){
                    var idx = Math.floor(Math.random() * (keys.length));
                    //console.log('Selecting key ' + idx);
                    keyQueue.push( keys[idx] );
                    copyOfKeyQueue.push( keys[idx] );
                }

                function sendKey() {
                    var k = keyQueue.shift();
                    console.log('Sending: ' + k);
                    key(k, (resp) => {
                        if (keyQueue.length !== 0)
                            setTimeout(sendKey, 1000);
                        else
                            cb(copyOfKeyQueue);
                    });
                }

                sendKey();
            }
        },
        'step9' : {
            'description'   : 'Check if screen still updates',
            'test'          : screenshot,
            'validate'      : (res) => {
                // check if we got an empty response
                if (res !== undefined && res.length > 0) {
                    if ( (task.previousSceenshot === undefined) ||
                         (task.previousSceenshot !== undefined && task.previousSceenshot.equals(res) === false)
                       ) {

                        // screen updated, save it and reset stuck counter
                        task.previousSceenshot = res;
                        task.curSameScreenshot = 0;
                        return true;
                    } else {
                        // screen is stuck
                        // check if we have reached the max threshold
                        if (task.curSameScreenshot >= task.maxSameScreenshot)
                            throw new Error('Screen is stuck, new screenshot is the same as previous screenshot for ' + task.curSameScreenshot + ' times.');

                        // update counter and go again
                        task.curSameScreenshot++;
                        return true;
                    }
                } else {
                    // empty response is an annoying bug in the Snapshot module. Trying to be a little more graceful about it by allowing Framework to return an empty screenshot from time to time
                    if (task.curSameScreenshot >= task.maxSameScreenshot)
                        throw new Error('Error screenshot returned is empty for ' + task.curSameScreenshot + ' times.');

                    // update counter and go again
                    task.curSameScreenshot++;
                    return true;
                }
            }
        },
        'step10' : {
            'description'   : 'Repeat for 3 hours',
            'goto'          : 'step7',
            'repeatTime'    : 3 * 60,
        }
    }
};
