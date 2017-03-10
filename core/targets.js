/*
 * WPETestFramework target configuration
 * Copyright (c) 2017 metrological.com
 */

devices = {
    'rpi2' : {
        'installer'         : 'rpi.js',
        'config'            : 'raspberrypi2_wpe_ml_defconfig',
        'username'          : 'root',
        'password'          : 'root'
    },
    'rpi' : {
        'installer'         : 'rpi.js',
        'config'            : 'raspberrypi_wpe_ml_defconfig',
        'username'          : 'root',
        'password'          : 'root'
    },
    'rpi3' : {
        'installer'         : 'rpi.js',
        'config'            : 'raspberrypi2_wpe_ml_defconfig',
        'username'          : 'root',
        'password'          : 'root'
    },
    'eos' : {
        'installer'         : 'eos.js',
        'nfsDir'            : '/home/wouter/nfs/eos', //Note! this dir will be deleted and recreated
        'tftpDir'           : '/home/wouter/tftp',
        'serialPort'        : '/dev/ttyUSB0',
        'config'            : 'eos_wpe_defconfig',
        'username'          : 'root',
        'password'          : 'root'
    },
    'bcm7425' : {
        'installer'         : 'bcmref.js',
        'nfsDir'            : '~/nfs/bcm7425', //Note! this dir will be deleted and recreated
        'tftpDir'           : '~/tftp',
        'config'            : 'bcm7425_wpe_ml_defconfig',
        'username'          : 'root',
        'password'          : 'root'
    },
    'bcm7429' : {
        'installer'         : 'bcmref.js',
        'nfsDir'            : '~/nfs/bcm7429', //Note! this dir will be deleted and recreated
        'tftpDir'           : '~/tftp',
        'config'            : 'bcm7429_wpe_ml_defconfig',
        'username'          : 'root',
        'password'          : 'root'
    },
    'dawn' : {
        'installer'         : 'dawn.js',
        'nfsDir'            : '/home/wouter/nfs/dawn', //Note! this dir will be deleted and recreated
        'tftpDir'           : '/home/wouter/tftp',
        'serialPort'        : '/dev/ttyUSB0',
        'config'            : 'dawn7002_wpe_defconfig',
        'username'          : 'root',
        'password'          : 'root'
    },
    'intelce' : {
        'installer'         : 'intelce.js',
        'config'            : 'intelce_wpe_defconfig',
        'nfsDir'            : '/home/wouter/nfs/intel', //Note! this dir will be deleted and recreated
        'tftpDir'           : '/home/wouter/tftp',
        'serialPort'        : '/dev/ttyUSB0',
        'username'          : 'root',
        'password'          : 'root'
    },
    'horizon' : {
        'installer'         : 'horizon.js',
        'config'            : 'horizon_v21_wpe_release_defconfig',
        'username'          : 'root',
        'password'          : 'root',
    },
    'intelce-oe' : {
        'installer'         : 'intelce.js',
        'nfsDir'            : '/home/wouter/nfs/inteloe', //Note! this dir will be deleted and recreated
        'tftpDir'           : '/home/wouter/tftp',
        'serialPort'        : '/dev/ttyUSB0',
        'username'          : 'root',
        'password'          : 'root'
    },
};

module.exports = {
    devices : devices,
};
