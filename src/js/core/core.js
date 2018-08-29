/**
 * WPE Test Framework core.js
 *
 * The core provides the ability to run tests in web workers, interface with a local agent (if available) and 
 * collect test results. 
 */


class Core {

	constructor() {
		this.activeTask = '';
		this.results = {};
		this.devices = [];
	}

	/**
	 *  Will attempt to on-board a device, get basic statics required to start collecting test results
	 */
	activateDevice(deviceObject) {

	}

	/**
	 * Removes a device from the active device list
	 */
	deleteDevice(deviceId) {

	}

	/** 
	 * Run spawns a webworker task.js which will execute the task selected
	 */
	run(deviceObject, task, params) {

	}

	// Getters
	getActiveTask() 	{ return this.activeTask; }
	getActiveDevces() 	{ return this.devices; }

}

window.classes = window.classes || {};
window.classes.Core = Core;
