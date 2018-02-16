/**
 * WPETestFramework dummy test task
 */
/*jslint esnext: true*/

module.exports = {
    'title'         : 'Dummy Test',
    'description'   : 'This is a dummy test',
    'steps'           : {
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
        'dummystep3' : {
            'description'   : 'Just a dummy test using custom test function',
            'timeout'       : 10,
            /* TEST */
            'test'          : (x, cb) => { cb(x); },
            'params'        : 1,
            /* RESULTS */
            'assert'        : 1
        },
        'dummystep4' : {
            'description'   : 'Just a dummy test that times out',
            'timeout'       : 10,
            'test'          : () => { /*  */ },
            'assert'        : 1,
        }
    },
    'cleanup' : function(cb) {
        console.log('This is a cleanup');
        cb('cleanup done');
    }
};
