/** 
 * WPETestFramework dummy test task
 */

test = {
    'title'         : 'Dummy Test Error2',
    'description'   : 'This tests extends a test that does not exist',
    'extends'       : 'foo.js',
    'steps'         : {
        'dummystep1' : {
            'description'   : 'Just a dummy test assert',
            'timeout'       : 10, //seconds
            'test'          : dummy,
            'params'        : 1,
            'assert'        : 1
        },
        'dummystep2' : {
            'description'   : 'Just a dummy test using validate',
            'timeout'       : 10, // ehhh, i dunno
            'test'          : (x, cb) => { cb(x) },
            'validate'      : (x) => { foo() }
        }
    }
};
