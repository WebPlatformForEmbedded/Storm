/** 
 * WPETestFramework dummy test task
 */
/*jslint esnext: true*/

module.exports = {
    'title'         : 'Dummy Test Repeat 2',
    'description'   : 'This is a dummy test that repeats a few steps',
    'steps'         : {
        'dummystep1' : {
            'description'   : 'Just a dummy test assert',
            'timeout'       : 10, //seconds
            'test'          : dummy,
            'params'        : 1,
            'assert'        : 1
        },
        'dummystep2' : {
            'description'   : 'Just a dummy test assert',
            'timeout'       : 10, //seconds
            'test'          : dummy,
            'params'        : 1,
            'assert'        : 1
        },       
        'dummystep3' : {
            'description'   : 'Just a dummy test assert',
            'timeout'       : 10, //seconds
            'test'          : dummy,
            'params'        : 1,
            'assert'        : 1
        }, 
        'dummystep4' : {
            'description'   : 'Repeat step 1, 10 times',
            'goto'          : 'dummystep1',
            'repeat'        : 10,
        },
        'dummystep5' : {
            'description'   : 'Just a dummy test using custom test function',
            'timeout'       : 10,
            'test'          : (x, cb) => { cb(x); },
            'params'        : 1,
            'assert'        : 1
        },
    }
};
