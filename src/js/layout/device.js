/** The Device page */

class DeviceView extends BaseView {
	constructor() {
		super()
		this.statusMessageTimer;
		this.status;
		this.lastSetIP = window.localStorage.getItem('lastSetIP') || '';
	}

	render() {
		this.mainDiv.innerHTML = `
			<div class="title grid__col grid__col--8-of-8">Please on-board a device</div>

			<div class="label grid__col grid__col--2-of-8">
				<label for="onboard_ip">Enter IP address</label>
			</div>
			<div class="text grid__col grid__col--6-of-8">
				<input type="text" id="onboard_ip" size="20" value="${this.lastSetIP}" />
				<button id="onboard_button" type="button">Check</button>
			</div>

			<div id="deviceInfo" class="messagebox hidden">
				<div class="title grid__col grid__col--8-of-8">Device Information</div>

				<div class="label grid__col grid__col--2-of-8">Name</div>
				<div id="name" class="text grid__col grid__col--6-of-8"></div>

				<div class="label grid__col grid__col--2-of-8">Device id</div>
				<div id="deviceid" class="text grid__col grid__col--6-of-8"></div>

				<div class="label grid__col grid__col--2-of-8">Version</div>
				<div id="version" class="text grid__col grid__col--6-of-8"></div>

				<div class="grid__col grid__col--4-of-8"></div>
				<div class="label grid__col grid__col--2-of-8" style="text-align:right">Is this correct?</div>
				<div class="text grid__col grid__col--2-of-8">
					<button id="continue_button" type="button">GO</button>
				</div>
			</div>

			<div id="statusDiv" class="text grid__col grid__col--8-of-8"></div>
		`;

		let onboard_button 		= document.getElementById('onboard_button');
		onboard_button.onclick 	= this.onBoard.bind(this);

		this.ipDiv 				= document.getElementById('onboard_ip');
		this.statusDiv 			= document.getElementById('statusDiv');
		this.deviceInfoDiv 		= document.getElementById('deviceInfo');
		this.nameDiv 			= document.getElementById('name');
		this.deviceIdDiv		= document.getElementById('deviceid');
		this.versionDiv			= document.getElementById('version');

		let continue_button		= document.getElementById('continue_button');
		continue_button.onclick = this.goToTests.bind(this);

		let deviceInfo		= wtf.getDeviceDetails();

		// we already have a device, render the info box
		if (deviceInfo.devicename !== null) {
			this.deviceInfoDiv.classList.remove('hidden');

			this.nameDiv.innerHTML = deviceInfo.devicename;
			this.deviceIdDiv.innerHTML = deviceInfo.deviceid;
			this.versionDiv.innerHTML = deviceInfo.version;
		}

	}

	onBoard() {
		var IP = document.getElementById('onboard_ip').value;

		if (IP === '' || IP === undefined) {
			this.status('Error, IP address cannot be empty');
			return;
		}

		wtf.activateDevice(IP, (deviceInfo) => {
			if (deviceInfo.error !== undefined) {
				this.status(deviceInfo.error);
				return;
			}

			this.deviceInfoDiv.classList.remove('hidden');

			this.nameDiv.innerHTML = deviceInfo.devicename;
			this.deviceIdDiv.innerHTML = deviceInfo.deviceid;
			this.versionDiv.innerHTML = deviceInfo.version;

			setOption({ 'host' : IP });
			window.localStorage.setItem('lastSetIP', IP);
		});
	}

	goToTests() {
		// Go to tests overview, yehaaw
		navigate('tests');
	}

	status(message) {
		window.clearTimeout(this.statusMessageTimer);
		this.statusDiv.innerHTML = message;

		// clear after 5s
		this.statusMessageTimer = setTimeout(this.status, 5000, '');
	}
}

window.views = window.views || {};
window.views.DeviceView = DeviceView;
