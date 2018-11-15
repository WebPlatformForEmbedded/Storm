/** 
 * WPETestFramework dummy test task
 */

test = {
    'title'         : 'Timeout main task',
    'description'   : 'This test times out at the task level',
    'timeout'       : 10, //s
    'steps'         : {
        'dummystep1' : {
            'description'   : 'Just a dummy test assert',
            'timeout'       : 10, //seconds
            'test'          : dummy,
            'params'        : 1,
            'assert'        : 1
        },
        'dummystep2' : {
            'description'   : 'A step that never ends',
            'timeout'       : 100000000, // ehhh, i dunno
            'test'          : (x, cb) => { /* ooops! */ },
            'assert'        : true
        }
    }
};
