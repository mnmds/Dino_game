import {Component} from '../Component/Component.js';


export class Viewport extends Component {
    static _css_url = true;
    static _dom_slot = true;
    // static _html_url = true;
    static _url = import.meta.url;

    // static _attributes = {
    //     ...super._attributes,
    // };

    static _eventListeners_target = {
        contextmenu: '_on_contextMenu',
        touchstart: ['_on_touchStart', {passive: false}],
    };


    static {
        this.init();
    }


    _init() {
        this.refresh(false);
    }

    _on_contextMenu(event) {
        event.preventDefault();
    }

    _on_touchStart(event) {
        event.preventDefault();
    }

    _refresh() {
        let elements = this.querySelectorAll('*');

        for (let element of elements) {
            element.refresh?.();
        }
    }
}
