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
        display: '',
        leafable: '',
        repeater_level: '',
        repeater_slider: '',
        slider: '',
        slider__container: '',
    };

    static _eventListeners_elements = {
        control_panel: {
            pointerdown: '_control_panel__on_pointerDown',
        },
        slider__container: {
            pointerdown: '_slider__on_pointerDown',
        },
        repeater_level: {
            add: '_repeater_level__on_add',
            define: '_repeater_level__on_add',
            pointerdown: '_repeater_level__on_pointerDown',
        },
    };


    static Repeater_level_manager = class extends Components.Repeater.Manager {
        _level = null;
        _level_status = null;


        data__apply() {
            this._level.innerHTML += this._model_item.level;
            this._level_status.statuses_values.sale.text = this._model_item.level_price || 0;
            this._level_status.status = this._model_item.level_status;
        }

        init() {
            this._level = this._item.querySelector('.level');
            this._level_status = this._item.querySelector('.level_status');

            this.data__apply();
        }
    };

    static Repeater_slider_manager = class extends Components.Repeater.Manager {
        _hero_image = null;
        _hero_name = null;
        _hero_status = null;


        data__apply() {
            this._hero_image.src = this._model_item.hero_image;
            this._hero_name.textContent = this._model_item.hero_name;
            this._hero_status.statuses_values.sale.text = this._model_item.hero_price || 0;
            this._hero_status.statuses_values.sold.text = 'Выбрать';
            this._hero_status.status = this._model_item.hero_status;
        }

        init() {
            this._hero_image = this._item.querySelector('.hero_image');
            this._hero_name = this._item.querySelector('.hero_name');
            this._hero_status = this._item.querySelector('.hero_status');

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
        this._elements.repeater_level.Manager = this.constructor.Repeater_level_manager;
        this._elements.repeater_slider.Manager = this.constructor.Repeater_slider_manager;

        this.data__insert(
            [
                {
                    level: 1,
                    level_status: 'sold',
                },
                {
                    level: 2,
                    level_status: 'selected',
                },
                {
                    level: 3,
                    level_status: 'sale',
                    level_price: 100000
                },
                {
                    level: 4,
                    level_status: 'sale',
                    level_price: 100001
                },
                {
                    level: 5,
                    level_status: 'sale',
                    level_price: 100002
                },
                {
                    level: 6,
                    level_status: 'sale',
                    level_price: 100003
                },
                {
                    level: 7,
                    level_status: 'sale',
                    level_price: 100004
                },
                {
                    level: 8,
                    level_status: 'sale',
                    level_price: 100005
                },
                {
                    level: 9,
                    level_status: 'sale',
                    level_price: 100006
                },
            ],
            [
                {
                    hero_image: './Storage/Images/Shop_heroes/Dino.png',
                    hero_name: 'ГДЗаврик',
                    hero_status: 'sale',
                    hero_price: 10000,
                },
                {
                    hero_image: './Storage/Images/Shop_heroes/Dino.png',
                    hero_name: 'q',
                    hero_status: 'selected',
                    hero_price: 10000,
                },
                {
                    hero_image: './Storage/Images/Shop_heroes/Dino.png',
                    hero_name: 'fee',
                    hero_status: 'sold',
                    hero_price: 10000,
                },
            ]
        );
    }

    _repeater_level__on_add() {
        this._elements.display.refresh();
    }

    _repeater_level__on_pointerDown(event) {
        let button = event.target.classList.contains('level_status') ? event.target : event.target.parentElement;

        if (!button.classList.contains('level_status')) return;
    }

    _slider__on_pointerDown(event) {
        if (!event.target.classList.contains('slider_arrow')) return;

        this._elements.slider.index += event.target.classList.contains('slider_arrow_next') ? 1 : -1;
    }


    data__insert(level_shop, hero_shop) {
        this._elements.repeater_level.model.clear();
        this._elements.repeater_slider.model.clear();
        this._elements.repeater_level.model.add(level_shop);
        this._elements.repeater_slider.model.add(hero_shop);
    }
}
