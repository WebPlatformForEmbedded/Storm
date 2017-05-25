/** 
 * WPETestFramework dummy test task
 */
/*jslint esnext: true*/

module.exports = {
    'title'         : 'Dummy Test',
    'description'   : 'Testing user input',
    'extends'       : 'DUMMY-SIMPLE-001',
    'steps'         : {
        'dummystep5' : {
            'description'   : 'User input step',
            'timeout'       : 360, //seconds
            'user'          : 'Please make test succeed or fail.',
            'assert'        : true
        }
    }
};
