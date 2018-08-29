/** 
 * WPETestFramework dummy test task
 */
/*jslint esnext: true*/

module.exports = {
    'title'         : 'Dummy Test',
    'description'   : 'This is a dummy test',
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
        'repeat1' : {
            'description'   : 'Repeat from dummystep 2',
            'goto'          : 'dummystep2',
            'repeat'        : 2
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