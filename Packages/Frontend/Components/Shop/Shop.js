import {Components} from '../../../Global/Frontend/Frontend.js';

import {ButtonBack} from '../ButtonBack/ButtonBack.js';


export class Shop extends Components.Component {
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        balance: 0,
    };

    static _elements = {
        balance: '',
        control_panel: '',
        leafable: '',
    };

    static _eventListeners_elements = {
        control_panel: {
            pointerdown: '_control_panel__on_pointerDown'
        }
    };


    static {
        this.init();
    }


    get balance() {
        return this._attributes.balance;
    }
    set balance(balance) {
        this._attribute__set('balance', balance);
        this._elements.balance.textContent = balance;
    }


    _control_panel__on_pointerDown(event) {
        let button = event.target.classList.contains('panel_button') ? event.target : event.target.parentElement;

        if (!button.classList.contains('panel_button')) return;

        let button_prev = this._elements.control_panel.children[2 - button.dataset.index];
        this._elements.leafable.index = button.dataset.index;

        button_prev.removeAttribute('active');
        button.setAttribute('active', true);
    }


    _init() {
        this.props__sync();
    }
}
