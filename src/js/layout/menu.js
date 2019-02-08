/** The landing page */

class MenuView extends BaseView {
    constructor() {
        super()
        this.top            = document.getElementById('top');
        this.mainDiv        = document.getElementById('main');
        this.menuItems = ['Device', 'Tests', 'Results'];

        var bodyEl = document.getElementsByTagName('body')[0];

        try {
            document.createEvent('TouchEvent');
            this.nav.style.left = '-600px';
            bodyEl.classList.remove('desktop');
            bodyEl.className = 'touch';
            this.isTouchDevice = true;
        } catch(e) {}

        // add the top header + logo + keyboard hooks
        this.top.innerHTML = `<div id="header" class="header">
          <div id="button-left" class="fa fa-bars left"></div>
        </div>

        <!--navigation-->
        <div id="menu" class="navigation"></div>
        `;

        this.header = document.getElementById('header');
        this.nav = document.getElementById('menu');

        var logo = new Image();
        logo.alt = 'Metrological';
        logo.onload = () => { this.header.appendChild(logo) };
        logo.src='img/ml.svg';

        // hooks
        document.getElementById('button-left').onclick = this.showMenu.bind(this);

        window.onresize = function () {
            if (this.isTouchDevice === true)
                return;

            var menu = document.getElementById('menu');
            if (window.innerWidth > 960) {
                menu.style.left = '0px';
            } else {
                menu.style.left = '-600px';
            }
        };

        var activeMenuItem = undefined;
        var ul = document.createElement('ul');

        for (var i = 0; i<this.menuItems.length; i++) {
            var menu = this.menuItems[i];

            var li = document.createElement('li');
            li.id = "item_" + menu;

            if (activeMenuItem === undefined && i === 0) {
                li.className = 'menu-item active';
            } else {
                li.className = 'menu-item';
            }

            li.appendChild(document.createTextNode(menu));
            li.onclick = this.toggleMenuItem.bind(this, menu);
            ul.appendChild(li);
            this.nav.appendChild(ul);
        }

    }

    toggleMenuItem(menuItem) {
        var items = document.getElementsByClassName('menu-item');
        for (var i = 0; i < items.length; i++) {
            if ('item_' + menuItem === items[i].id) {
                items[i].className = 'menu-item active';
            } else {
                items[i].className = 'menu-item';
            }
        }

        navigate(menuItem.toLowerCase());
    }

    showMenu() {
        var menu = document.getElementById('menu');

        if (menu.style.left === '0px') {
            menu.style.left = '-600px';
        } else {
            menu.style.left = '0px';
        }
    }
}

window.views = window.views || {};
window.views.MenuView = MenuView;
