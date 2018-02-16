/** 
 * WPETestFramework dummy test task
 */
/*jslint esnext: true*/

module.exports = {
    'title'         : 'Dummy Test timeout2',
    'description'   : 'This test times out at the task level',
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
            'timeout'       : 100000000, // ehhh, i dunno
            'test'          : (x, cb) => { /* ooops! */ },
            'assert'        : true
        }
    }
};
