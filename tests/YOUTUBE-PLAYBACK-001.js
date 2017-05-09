/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'             : 'YouTube Playback test',
    'description'       : 'Start playback of a movie on YouTube and let it run for 12 hours',
    'requiredPlugins'   : ['WebKitBrowser'],
    'maxSameScreenshot' : 5, // amount of times its okay to have the same screenshot
    'curSameScreenshot' : 0, // counter
    'prevScreenshot'    : undefined,
    'steps'             : {
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
            'sleep'         : 20,
            'description'   : 'Send enter key to start playback',
            'test'          : key,
            'params'        : enter,
            'validate'      : httpResponseSimple
        },
        'step9' : {
            'sleep'         : 60,
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
            'description'   : 'Repeat for 12 hours',
            'goto'          : 'step9',
            'repeatTime'    : 12 * 60,
        }
    }
};
