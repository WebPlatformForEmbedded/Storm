/** The landing page */

class Tests extends BaseView {
	constructor() {
		super()
	}

	render() {
		// todo, no device onboarded, let user know
		if (host === undefined) {
			this.mainDiv.innerHTML = '<div class="title grid__col grid__col--8-of-8">No device onboarded, please go to devices and select a device</div>';
			return;
		}

		// render tests from test manifest
		var tableStr = `<div class="table">
				<div class="row header">
					<div class="cell">
						Test ID
					</div>
					<div class="cell">
						Description
					</div>
					<div class="cell">
						Result
					</div>
				</div>`;

		let testsArray = Object.keys(wtf.tests);

		for (var i=0; i<testsArray.length; i++) {
			let _testName 	= testsArray[i];
			let test 		= wtf.tests[ _testName ];

			if (wtf.dummyMode !== true && test.name.slice(0,5) === 'DUMMY')
				continue;

			tableStr += `<div id="${test.name}_row" class="row">
					<div class="cell">
						${test.name}
					</div>
					<div class="cell">
						${test.description}
					</div>
					<div class="cell">
						Not Started
					</div>
				</div>`;
		}

		this.mainDiv.innerHTML = tableStr;

		// bind all tests after theyve been added to the DOM
		for (var k=0; k<testsArray.length; k++) {
			let _testName 	= testsArray[k];
			let test 		= wtf.tests[ _testName ];
			let _div 		= document.getElementById(test.name + '_row');
			_div.onclick 	= this.showTest.bind(this, test.name);
		}
	}

	showTest(test) {
		navigate('test', test);
	}

}

window.views = window.views || {};
window.views.Tests = Tests;
