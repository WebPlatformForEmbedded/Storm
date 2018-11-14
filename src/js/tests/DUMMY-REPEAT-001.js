/** 
 * WPETestFramework dummy test task
 */

test = {
    'title'         : 'Dummy Test Repeat',
    'description'   : 'This is a dummy test that repeats a few steps',
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
            'description'   : 'Repeat step 1, 10 times',
            'goto'          : 'dummystep1',
            'repeat'        : 10,
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
