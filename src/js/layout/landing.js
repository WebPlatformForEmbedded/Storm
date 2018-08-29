/** The landing page */

class Landing extends BaseView {
    constructor(tests) {
    	super()
    	self = this;
    	self.tests = tests;
        self.mainDiv = document.getElementById('main');
    }

    render() {
        self.mainDiv.innerHTML = '<div class="text">Hello world</div>';
    }
}

window.views = window.views || {};
window.views.Landing = Landing;
