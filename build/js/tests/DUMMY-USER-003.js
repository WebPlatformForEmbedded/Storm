/** 
 * WPETestFramework dummy test task
 */

test = {
    'title'         : 'Dummy Test',
    'description'   : 'Testing user input that times out',
    'extends'       : 'DUMMY-SIMPLE-001',
    'steps'         : {
        'dummystep1' : {
            'description'   : 'User input step',
            'timeout'       : 20, //seconds
            'user'          : 'Test times out, dont do anything.',
            'assert'        : true
        }
    }
};
