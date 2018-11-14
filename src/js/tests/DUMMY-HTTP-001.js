/** 
 * WPETestFramework dummy test task
 */

test = {
    'title'         : 'Dummy HTTP Test',
    'description'   : 'This is a simple HTTP test',
    'steps'         : {
        'dummystep1' : {
            'description'   : 'GET A test URL',
            'timeout'       : 180, //seconds
            'test'          : http,
            'params'        : { url: `http://www.metrological.com`, method: 'GET' },
            'validate'      : httpResponseSimple
        },
    }
};
