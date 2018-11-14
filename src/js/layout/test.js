/** The landing page */

class Test extends BaseView {
	constructor() {
		super()

		this.testName = null;
		this.test = null;
	}

	render(_testName) {
		this.testName = _testName;
		this.test = null;

		// todo, no device onboarded, let user know
		if (host === undefined) {
			this.mainDiv.innerHTML = '<div class="title grid__col grid__col--8-of-8">No device onboarded, please go to devices and select a device</div>';
			return;
		}

		// read test from server, load it
		let _t = wtf.tests[ this.testName ];

		if (_t === undefined) {
			navigate('tests');
			return;
		}

		loadTest(_t.file, (resp) => {
			if (resp.error) {
				this.mainDiv.innerHTML = `
				<div class="text grid__col grid__col--8-of-8">Error loading test:</div>'
				<div class="text grid__col grid__col--8-of-8">${resp.error}</div>'`;

				return;
			}

			if (resp.test) {
				this.test = resp.test;

				// render title / description
				let html = `
					<div class="title grid__col grid__col--2-of-8">Name</div>
					<div class="text grid__col grid__col--6-of-8">${this.testName}</div>

					<div class="title grid__col grid__col--2-of-8">Title</div>
					<div class="text grid__col grid__col--6-of-8">${this.test.title}</div>

					<div class="title grid__col grid__col--2-of-8">Description</div>
					<div class="text grid__col grid__col--6-of-8">${this.test.description}</div>

					<div class="title grid__col grid__col--2-of-8">Progress</div>
					<div id="progress" class="text grid__col grid__col--2-of-8">0%</div>

					<div class="title grid__col grid__col--2-of-8"></div>
					<div id="result" class="text grid__col grid__col--2-of-8">-</div>

					<div class="text grid__col grid__col--8-of-8"> </div>

					<div class="grid__col grid__col--7-of-8">
						<div class="table">
							<div class="row header">
								<div class="cell">Step</div>
								<div class="cell">Result</div>
							</div>`;

				var _steps = Object.keys(this.test.steps);

				for (var i=0; i<_steps.length; i++) {
					var _step = this.test.steps[ _steps[ i ] ];

					html += `
						<div id="" class="row">
							<div class="cell">${i+1}. ${_step.description}</div>
							<div class="cell">Not Started</div>
						</div>`;
				}


				html += `</div></div>

					<div class="title grid__col grid__col--6-of-8"></div>
					<div class="text grid__col grid__col--2-of-8">
						<button id="start_button" type="button">Run</button>
					</div>`;


				this.mainDiv.innerHTML = html;

				this.progressEl 		= document.getElementById('progress');
				let start_button 		= document.getElementById('start_button');
				start_button.onclick 	= this.startTest.bind(this);

				console.log(this.test);
			}
		});

	}

	startTest() {
		wtf.run(this.testName, this.updateProgress);
	}

	updateProgress(message) {
		console.log('updateProgress: ' + message);
	}

}

window.views = window.views || {};
window.views.Test = Test;
