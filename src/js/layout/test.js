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
			navigate('tests');
			return;
		}

		wtf.loadTest(_t.file, (resp) => {
			if (resp.error) {
				this.mainDiv.innerHTML = 'Error loading test';
				return;
			}

			if (resp.test) {

				var test = resp.test;

				// render title / description
				this.mainDiv.innerHTML = `
					<div class="title grid__col grid__col--4-of-8">Test name</div>
					<div class="text grid__col grid__col--4-of-8">${test.title}</div>

					<div class="title grid__col grid__col--4-of-8">Description</div>
					<div class="text grid__col grid__col--4-of-8">${test.description}</div>

					<div class="grid__col grid__col--7-of-8">
						<div class="table">
							<div class="row header">
								<div class="cell">
									Step
								</div>
								<div class="cell">
									Result
								</div>
							</div>`;

				var _steps = Object.keys(test.steps);


				for (var i=0; i<_steps.length; i++) {
					var _step = test.steps[ _steps[ i ] ];

					this.mainDiv.innerHTML += `
						<div id="" class="row">
							<div class="cell">
								${_step.description}
							</div>
							<div class="cell">
								Not Started
							</div>
						</div>`;
				}

				this.mainDiv.innerHTML += '</div></div>'

				console.log(resp.test)
			}
		});



		// render table with steps and unfilled results

		// show controls, abitily to run it

	}

}

window.views = window.views || {};
window.views.Test = Test;
