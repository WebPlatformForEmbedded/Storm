/*
 * WPETestFramework
 * Device class
 *
 * Copyright (c) 2017 Metrological.com
 *
 */
/*jslint esnext: true*/
'use strict';

class Device {
    constructor(id, guid, hostname, type, dialData) {
        this.id         = id;
        this.guid       = guid;
        this.hostname   = hostname;
        this.type       = type;
        this.dialData   = dialData;
    }

}

module.exports = Device;