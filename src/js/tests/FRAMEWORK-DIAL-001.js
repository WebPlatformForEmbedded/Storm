/**
 * WPETestFramework test
 */
/*jslint esnext: true*/

NotApplicable('This test needs to be updated for webbased DIAL support');

test = {
    'disabled'          : 'true',
    'title'             : 'Framework DIAL test 01',
    'description'       : 'Tests if the host is discoverable on DIAL and returns a list of applications',
    'requiredPlugins'   : ['DIALServer'],
    'steps'             : {
        'step1' : {
            'description'   : 'Start the DIAL server plugin',
            'test'          : startPlugin,
            'params'        : 'DIALServer',
            'validate'      : httpResponseSimple
        },
        'step2' : {
            'description'   : 'Check if plugin is started',
            'sleep'         : 10,
            'test'          : getPluginState,
            'params'        : 'DIALServer',
            'assert'        : 'activated'
        },
        'setAppStore' : {
            'description'   : 'Set the App Store URL',
            'test'          : setUrl,
            'params'        : 'http://widgets.metrological.com/liberty/nl/rpi-reference',
        },
        'step3' : {
            'sleep'         : 15,
            'description'   : 'Perform a discovery on DIAL and check if the device is present',
            'timeout'       : 30, //seconds
            'test'          : dialDiscover,
            'validate'      : function(response) {
                // should return a list of devices
                if (response.length === 0)
                    throw new Error('Empty response from DIAL');

                for (var i=0; i < response.length; i++) {
                    // check if the ip matches
                    if (host === response[i].URL.hostname) {
                        test.steps.step1.dialDevice = response[i];
                        return true;
                    }

                    // we didn't find it, sorry!
                    if (i === response.length-1)
                        throw Error('Device not found on DIAL discovery');
                }
            },
        },
        'step4' : {
            'description'   : 'Validate if the device returns a valide DIAL response',
            'test'          : function(cb) {
                var dialDevice = test.steps.step1.dialDevice;

                /*
              applicationUrl: 'http://192.168.11.103:8080/Service/DIALServer/Apps',
              deviceType: 'urn:schemas-upnp-org:device:tvdevice:1',
              friendlyName: '[TV] Framework',
              manufacturer: 'Metrological',
              modelName: 'Generic Platform',
              UDN: 'uuid:0000000000',
              icons: [] }
                */

                if (dialDevice.applicationUrl   === undefined ||
                    dialDevice.deviceType       === undefined ||
                    dialDevice.friendlyName     === undefined ||
                    dialDevice.manufacturer     === undefined ||
                    dialDevice.modelName        === undefined ||
                    dialDevice.UDN              === undefined ||
                    dialDevice.icons            === undefined
                    )
                    throw new Error('Missing fields in DIAL response.')
                else
                    cb(true);
            },
            'assert'        : true
        },
        'step5' : {
            'description'   : 'Cleanup test, reset WPEWebkit URL',
            'test'          : setUrl,
            'params'        : 'about:blank'
        }
    },
    'cleanup'       : restartFramework
};
