/** 
 * WPETestFramework dummy test task
 */
/*jslint esnext: true*/

module.exports = {
    'title'         : 'Dummy Test',
    'description'   : 'Testing user input',
    'extends'       : 'dummy.js',
    'steps'         : {
        'dummystep1' : {
            'description'   : 'User input step',
            'timeout'       : 360, //seconds
            'user'          : 'Please make test succeed or fail.'
        }
    }
};
