import {Components} from '../../../Global/Frontend/Frontend.js';

import {ButtonBack} from '../ButtonBack/ButtonBack.js';
import {ShopButton} from '../ShopButton/ShopButton.js';


export class Shop extends Components.Component {
    static _components = [Components.Flickable, Components.Repeater, ShopButton];
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
        repeater_level: '',
        display: '',
    };

    static _eventListeners_elements = {
        control_panel: {
            pointerdown: '_control_panel__on_pointerDown',
        },
        repeater_level: {
            add: '_repeater_level__on_add',
            define: '_repeater_level__on_add',
        },
    };

    static Repeater_level_manager = class extends Components.Repeater.Manager {
        _level = null;
        _level_status = null;

        data__apply() {
            this._level.textContent = this._model_item.level;
            this._level_status.status = this._model_item.level_status;
        }

        init() {
            this._level = this._item.querySelector('.level');
            this._level_status = this._item.querySelector('.level_status');

            this.data__apply();
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
        if (!!this._elements.leafable._animation_end) return;

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

    _repeater_level__on_add() {
        this._elements.display.refresh();
    }
}
