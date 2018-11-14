/**
 * WPETestFramework dummy test task
 */

test = {
    'title'         : 'Dummy Test Error',
    'description'   : 'This tests has an empty task object',
    'steps'         : {

    },
    'cleanup'       : function(cb) {
        console.log('This is the cleanup function');
        cb('Done!');
    }
};
