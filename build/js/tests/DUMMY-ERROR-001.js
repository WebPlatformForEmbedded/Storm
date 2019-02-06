/** 
 * WPETestFramework dummy test task
 */

test = {
    'title'         : 'Dummy Test Error',
    'description'   : 'This tests throws an error in the test execution',
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
            'test'          : (x, cb) => { foo(); },
            'assert'        : true
        }
    }
};
