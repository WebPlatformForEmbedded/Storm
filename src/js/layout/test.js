/** The landing page */

class TestView extends BaseView {
    constructor() {
        super()

        this.testName = null;
        this.test = null;
        this.repeatMessage = new RepeatMessage();
    }

    render(_testName) {
        if (_testName === undefined) {
            navigate('tests');
            return;
        }

        this.testName = _testName;
        wtf.registerForTestProgress(this.updateProgress.bind(this));

        // todo, no device onboarded, let user know
        if (host === undefined) {
            this.mainDiv.innerHTML = '<div class="title grid__col grid__col--8-of-8">No device onboarded, please go to devices and select a device</div>';
            return;
        }

        // read test from server, load it
        let _t = wtf.tests[ this.testName ];

        if (_t === undefined) {
            this.clear();
            navigate('tests');
            return;
        }

        if (_t.loaded === false) {
            _t.load((resp) => {
                if (resp.error) {
                    this.renderError(resp.error);
                    return;
                }

                if (resp.test === undefined) {
                    this.renderError('Test not found');
                    return;
                }

                this.test = resp.test;
                this.renderTest();
            });
        } else {
            this.test = _t;
            this.renderTest(_t);
        }

    }

    clear() {
        wtf.deregisterForTestProgress(this.updateProgress);
        this.testName = null;
        this.test = null;
    }

    renderError(error) {
        this.mainDiv.innerHTML = `
        <div class="text grid__col grid__col--8-of-8">Error loading test:</div>'
        <div class="text grid__col grid__col--8-of-8">${error}</div>'`;

        return;
    }

    renderTest() {
        // render title / description
        let html = `
            <div id="screenshot" class="canvas_in_test"></div>

            <div class="title grid__col grid__col--2-of-8">Name</div>
            <div class="text grid__col grid__col--3-of-8">${this.testName}</div>
            <div class="grid__col grid__col--3-of-8"></div>

            <div class="title grid__col grid__col--2-of-8">Title</div>
            <div class="text grid__col grid__col--3-of-8">${this.test.title}</div>
            <div class="grid__col grid__col--3-of-8"></div>

            <div class="title grid__col grid__col--2-of-8">Description</div>
            <div class="text grid__col grid__col--3-of-8">${this.test.description}</div>
            <div class="grid__col grid__col--3-of-8"></div>

            <div class="title grid__col grid__col--2-of-8">Progress</div>
            <div id="progressBarDiv" class="text grid__col grid__col--2-of-8">
                <progress max="100" value="${this.test.getPercCompleted()}" id="progressBar"></progress>
            </div>
            <div id="progress" class="text grid__col grid__col--2-of-8">${this.test.getPercCompleted()}%</div>

            <div id="result" class="text grid__col grid__col--2-of-8">${this.test.getState()}</div>

            <div class="text grid__col grid__col--1-of-8"></div>
            <div id="error" class="text grid__col grid__col--7-of-8">${this.test.getError()}</div>

            <div class="grid__col grid__col--7-of-8">
                <div class="table">
                    <div class="row header">
                        <div class="cell">Step</div>
                        <div class="cell"></div>
                        <div class="cell">Result</div>
                    </div>`;

        if (this.test.steps === undefined) {
            html += `<div class="row">
                    <div class="text grid__col grid__col--2-of-8">Test has no steps</div>
                </div>`;
        } else {
            var _steps = Object.keys(this.test.steps);
            this.stepLength = _steps.length;

            for (var i=0; i<_steps.length; i++) {
                var _step = this.test.steps[ _steps[ i ] ];

                html += `<div class="row">
                        <div class="cell">${i+1}. ${_step.description}</div>
                        <div class="cell">${_step.sleep ? 'Sleep: ' + _step.sleep + 's' : ''}</div>
                        <div id="step_progress_${i}" class="cell">${_step.getState()}</div></div>`;
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
        wtf.run(this.testName);
    }

    updateProgress(data) {
        this.renderTest();

        /*
        switch (data.messageContext) {
            case 'TestMessage':

                this.errorEl.innerHTML = this.test.getError();
                this.resultEl.innerHTML = this.test.getState();
                break;

            case 'StepMessage':
                let stepEl = document.getElementById('step_progress_' + data.stepIdx);
                let step = this.test.steps[ data.name ]

                stepEl.innerHTML = step.getState();

                // only update % if state is > running
                if (step.state > 1) {
                    let perctCompleted = this.test.getPercCompleted();

                    this.progressBar.value = perctCompleted;
                    this.progressEl.innerHTML = perctCompleted + '%';
                }

                break;

            case 'RepeatMessage':
                let repeatStepEl = document.getElementById('step_progress_' + data.stepIdx);

                console.log(data);

                if (data.repeatType === this.repeatMessage.repeatTypes.count) {
                    let repeatProgress = (( (data.repeatByCount.total - data.repeatByCount.remaining) / data.repeatByCount.total) * 100).toFixed(0);
                    repeatStepEl.innerHTML = `Running. <br><progress max="100" value="${repeatProgress}"></progress> ${repeatProgress}%`;
                    this.resultEl.innerHTML = `Repeating. <br><progress max="100" value="${repeatProgress}"></progress> ${repeatProgress}%`;
                }

                if (data.repeatType === this.repeatMessage.repeatTypes.time) {
                    let timeRemaining = moment(data.repeatByTime.until).toNow(true);
                    repeatStepEl.innerHTML = `Running. <br><br>Repeats: ${data.repeatByTime.timesRepeated} and ${timeRemaining} remaining.`;
                    this.resultEl.innerHTML = `Repeating. <br>${data.repeatByTime.timesRepeated} and ${timeRemaining} remaining.`;
                }

                break;
        }
        */

    }

}

window.views = window.views || {};
window.views.TestView = TestView;
