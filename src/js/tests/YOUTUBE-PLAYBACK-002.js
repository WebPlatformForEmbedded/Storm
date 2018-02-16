/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

module.exports = {
    'title'             : 'YouTube Playback test',
    'description'       : 'Start playback of an 8 hour movie on YouTube and let it run',
    'requiredPlugins'   : ['Snapshot', 'WebKitBrowser'],
    'maxSameScreenshot' : 5, // amount of times its okay to have the same screenshot
    'curSameScreenshot' : 0, // counter
    'prevScreenshot'    : undefined,
	'extends'           : 'YOUTUBE-PLAYBACK-001.js', // use YOUTUBE-PLAYBACK-001.js as base, extend just the required functions
    'steps'             : {
        'step5' : {
            'description'   : 'Set YouTube URL',
            'test'          : setUrl,
            'params'        : 'https://www.youtube.com/tv#/watch/video/control?v=RDfjXj5EGqI',
            'validate'      : httpResponseSimple,
        },
        'step6' : {
            'sleep'         : 10,
            'description'   : 'Check if the URL is loaded correctly',
            'test'          : getUrl,
            'assert'        : 'https://www.youtube.com/tv#/watch/video/control?v=RDfjXj5EGqI'
        },
        'step9' : {
            'description'   : 'Repeat for 8 hours',
            'goto'          : 'step8',
            'repeatTime'    : 8 * 60,
        },
        'step10' : {
            'description'   : 'Cleanup the test',
            'test'          : setUrl,
            'params'        : 'about:blank'
        }
    }
};
