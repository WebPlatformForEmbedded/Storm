/** The landing page */

class Test extends BaseView {
    constructor() {
        super()

        this.testName = null;
        this.test = null;
        this.testMessage = new TestMessage();
        this.stepMessage = new StepMessage();
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
                this.renderError(resp.error);
                return;
            }

            if (resp.test === undefined) {
                this.renderError('Test not found');
                return;
            }

            if (resp.test.extends !== undefined && resp.test.exteds !== '') {
                // test extends another test, lets load that one too
                loadTest('js/tests/' + resp.test.extends + '.js', (_resp) => {
                    if (_resp.error) {
                        this.renderError(_resp.error);
                        return;
                    }


                    if (_resp.test) {
                        // merge tests
                        for (var attrname in _resp.test.steps)
                            resp.test.steps[attrname] = _resp.test.steps[attrname];

                        this.renderTest(resp.test);
                    } else {
                        this.renderError('Cannot load test that needs to be extended: ', resp.test.extends);
                    }
                });
            } else {
                this.renderTest(resp.test);
            }

        });

    }

    renderError(error) {
        this.mainDiv.innerHTML = `
        <div class="text grid__col grid__col--8-of-8">Error loading test:</div>'
        <div class="text grid__col grid__col--8-of-8">${error}</div>'`;

        return;
    }

    renderTest(test) {
        // render title / description
        let html = `
            <div class="title grid__col grid__col--2-of-8">Name</div>
            <div class="text grid__col grid__col--6-of-8">${this.testName}</div>

            <div class="title grid__col grid__col--2-of-8">Title</div>
            <div class="text grid__col grid__col--6-of-8">${test.title}</div>

            <div class="title grid__col grid__col--2-of-8">Description</div>
            <div class="text grid__col grid__col--6-of-8">${test.description}</div>

            <div class="title grid__col grid__col--2-of-8">Progress</div>
            <div id="progressBarDiv" class="text grid__col grid__col--2-of-8">
                <progress max="100" id="progressBar"></progress>
            </div>
            <div id="progress" class="text grid__col grid__col--2-of-8">0%</div>

            <div id="result" class="text grid__col grid__col--2-of-8">-</div>

            <div class="text grid__col grid__col--1-of-8"></div>
            <div id="error" class="text grid__col grid__col--7-of-8"></div>

            <div class="grid__col grid__col--7-of-8">
                <div class="table">
                    <div class="row header">
                        <div class="cell">Step</div>
                        <div class="cell">Result</div>
                    </div>`;

        if (test.steps === undefined) {
            html += `<div class="row">
                    <div class="text grid__col grid__col--2-of-8">Test has no steps</div>
                </div>`;
        } else {
            var _steps = Object.keys(test.steps);
            this.stepLength = _steps.length;

            for (var i=0; i<_steps.length; i++) {
                var _step = test.steps[ _steps[ i ] ];

                html += `<div class="row">
                        <div class="cell">${i+1}. ${_step.description}</div>
                        <div id="step_progress_${i}" class="cell">Not Started</div>
                    </div>`;
            }
        }




        html += `</div></div>

            <div class="title grid__col grid__col--6-of-8"></div>
            <div class="text grid__col grid__col--2-of-8">
                <button id="start_button" type="button">Run</button>
            </div>`;


        this.mainDiv.innerHTML = html;

        this.progressEl         = document.getElementById('progress');
        this.progressBar        = document.getElementById('progressBar');
        this.resultEl           = document.getElementById('result');
        this.errorEl            = document.getElementById('error');
        let start_button        = document.getElementById('start_button');
        start_button.onclick    = this.startTest.bind(this);
    }

    startTest() {
        wtf.run(this.testName, this.updateProgress.bind(this));
    }

    updateProgress(data) {
        switch (data.name) {
            case 'TestMessage':
                if (data.completed === true) {
                    if (data.state !== this.testMessage.states.success && data.result !== undefined)
                        this.errorEl.innerHTML = data.result;
                } 
                else if (data.state === this.testMessage.states.start)
                    this.resultEl.innerHTML = 'Started';
                else if (data.state === this.testMessage.states.success) 
                    this.resultEl.innerHTML = 'Success';
                else if (data.state === this.testMessage.states.error)
                    this.resultEl.innerHTML = 'Error';
                else if (data.state === this.testMessage.states.timedout)
                    this.resultEl.innerHTML = 'Timed out';
                else if (data.state === this.testMessage.states.notapplicable)
                    this.resultEl.innerHTML = 'Not Applicable';

                break;

            case 'StepMessage':
                let stepEl = document.getElementById('step_progress_' + data.stepIdx);

                if (data.state === this.stepMessage.states.init)
                    stepEl.innerHTML = 'Init';
                else if (data.state === this.stepMessage.states.start)
                    stepEl.innerHTML = 'Running';
                else if (data.state === this.stepMessage.states.response)
                    stepEl.innerHTML = 'Response';
                else if (data.state === this.stepMessage.states.success)
                    stepEl.innerHTML = 'Success';
                else if (data.state === this.stepMessage.states.failed)
                    stepEl.innerHTML = 'Failed';


                // only update % if state is > running
                if (data.state > 1) {
                    let progressPerct = ( ((data.stepIdx+1) / this.stepLength) * 100).toFixed(0);
                    this.progressBar.value = progressPerct;
                    this.progressEl.innerHTML = progressPerct + '%';
                }

                break;
        }

    }

}

window.views = window.views || {};
window.views.Test = Test;
