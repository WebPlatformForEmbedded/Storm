/**
 * WPETestFramework horizon specific functionity
 */
/*jslint esnext: true*/

const net = require('net');

var connected = false;
var client;

module.exports = {
    // key definitions
    'ok'        : 'e001',
    'enter'     : 'e001', //mapping enter to OK
    'power'     : 'e000',
    'channel+'  : 'e006',
    'channel-'  : 'e007',
    'stop'      : 'e402',
    'forward'   : 'e405',
    'rewind'    : 'e407',
    'play'      : 'e400',
    'record'    : 'e403',
    'previous linear': 'ef20',
    'red'       : 'e200',
    'green'     : 'e201',
    'yellow'    : 'e202',
    'blue'      : 'e203',
    'up'        : 'e100',
    'down'      : 'e101',
    'left'      : 'e102',
    'right'     : 'e103',
    'menu'      : 'ef00',
    'back'      : 'e002',
    'esc'       : 'e002', //mapping esc to back
    'help'      : 'e009',
    'info'      : 'e00e',
    'myrecordings': 'ef29',
    'tvguide'   : 'e00b',
    'ondemand'  : 'ef28',
    'text'      : 'e00f',
    'one'       : 'e301',
    'two'       : 'e302',
    'three'     : 'e303',
    'four'      : 'e304',
    'five'      : 'e305',
    'six'       : 'e306',
    'seven'     : 'e307',
    'eight'     : 'e308',
    'nine'      : 'e309',
    'zero'      : 'e300',
    // override keys to send keys to Cisco, since webbridge soft-remote doesn't work
    key(_key, cb) {
        if (connected === false) {
            connect(_key, cb);
            return;
        }

        var mt = '04'; // message type for keyEvent
        var kd = '01'; // key pressed
        var ku = '00'; // key released
        var p = '00000000'; // padding

        var keyDown = new Buffer(mt + kd + p + _key, 'hex');
        var keyUp   = new Buffer(mt + ku + p + _key, 'hex');

        client.write(keyDown);
        client.write(keyUp);

        cb();
    },
};

function connect(_key, cb) {
    client = net.connect(5900, host, () => {
        console.log('Connected to Horizon!');
        connected = true;
    });

    // handshake stuff
    client.on('data', (data) => {
        var respStr = data.toString();
        var respHex = data.toString('hex');

        //receive and echo the version: "RFB 003.008\n"
        if (respStr.slice(0,3) === 'RFB'){
            console.log('echoing: ', respStr);
            client.write(respStr);
        }

        if (respHex === '0101') {
            console.log('got security scheme returning x01');
            client.write(new Buffer('01', 'hex'));
        }

        if (respHex === '00000000') {
            console.log('got security result, sending init flag x01');
            client.write(new Buffer('01', 'hex'));

            // calling key again
            setTimeout(key, 5000, _key, cb);
        }
    });

    client.on('end', () => {
        console.log('disconnected from server');
        connected = false;
    });

    client.on('error', (e) => {
        console.log('Error connecting to Horizon key interface', e);
        connected = false;
    });
}