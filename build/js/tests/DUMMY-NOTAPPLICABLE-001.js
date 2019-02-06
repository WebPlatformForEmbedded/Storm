/** 
 * WPETestFramework dummy test task
 */

NotApplicable('This test is not applicable');

test = {
    'title'         : 'Dummy Test',
    'description'   : 'This test throws a N/A in the beginning of the test with invalid objects in the test',
    'steps'         : {
        'dummystep1' : {
            'description'   : 'Just a dummy test assert',
            'timeout'       : 10, //seconds
            /* TEST */
            'test'          : dummy,
            'params'        : 1,
            /* RESULTS */
            'assert'        : 1
        },
        'dummystep2' : {
            'description'   : 'Just a dummy test using validate',
            'timeout'       : 10,
            /* TEST */
            'test'          : dummy,
            /* RESULTS */
            'validate'      : (x) => { return true; } //use validate for manual validation
        },
        'sleep1' : {
            'description'   : 'Sleeping 10 seconds',
            'sleep'         : 3,
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
        'dummystep5' : {
            'description'   : 'Just a dummy test with a sleep',
            'sleep'         : 3,
            'timeout'       : 30,
            /* TEST */
            'test'          : dummy,
            'params'        : 1,
            /* RESULTS */
            'assert'        : 1
        },
    }
};
