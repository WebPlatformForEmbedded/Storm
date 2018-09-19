/** The landing page */

class Test extends BaseView {
	constructor() {
		super()
	}

	render(_testName) {
		// todo, no device onboarded, let user know
		if (wtf.host === undefined) {
			this.mainDiv.innerHTML = '<div class="title grid__col grid__col--8-of-8">No device onboarded, please go to devices and select a device</div>';
			return;
		}

		// read test from server, load it
		let _t = wtf.tests[ _testName ];

		if (_t === undefined) {
			this.mainDiv.innerHTML = '<div class="title grid__col grid__col--8-of-8">Test not found. Game over, insert coin to continue.</div>';
			return;
		}

		var jsElm = document.createElement('script');
		jsElm.type = 'application/javascript';
		jsElm.src = _t.file;
		document.body.appendChild(jsElm);

		console.log(test);

		// render title / description

		// render table with steps and unfilled results

		// show controls, abitily to run it

	}

}

window.views = window.views || {};
window.views.Test = Test;
