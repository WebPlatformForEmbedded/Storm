/** 
 * WPETestFramework dummy test task
 */

test = {
    'title'         : 'Dummy Test Repeat Timebased',
    'description'   : 'This is a dummy test that repeats a few steps based on time',
    'steps'         : {
        'dummystep1' : {
            'description'   : 'Just a dummy test assert',
            'timeout'       : 10, //seconds
            'sleep'         : 2, //seconds
            /* TEST */
            'test'          : dummy,
            'params'        : 1,
            /* RESULTS */
            'assert'        : 1
        },
        'dummystep2' : {
            'description'   : 'Repeat step 1 for 1 minute',
            'goto'          : 'dummystep1',
            'repeatTime'    : 1, //minutes
        },
        'dummystep3' : {
            'description'   : 'Just a dummy test using custom test function',
            'timeout'       : 10,
            /* TEST */
            'test'          : (x, cb) => { cb(x); },
            'params'        : 1,
            /* RESULTS */
            'assert'        : 1
        },
    }
};
