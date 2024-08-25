import {Components} from '../../../Global/Frontend/Frontend.js';
import {Units} from '../../../Global/Frontend/Frontend.js' ;

import {RestClient} from '../../../Global/Js/Js.js';

import {User_messages_enums} from '../../Units/Units.js';
import {Replacement} from '../../Units/Units.js';

import {ButtonBack} from '../ButtonBack/ButtonBack.js';
import {ShopButton} from '../ShopButton/ShopButton.js';


export class Shop extends Components.Component {
    static _components = [
        ButtonBack,
        Components.Flickable,
        Components.Leafable,
        Components.Repeater,
        ShopButton,
    ];

    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        balance: 0,
        language: 'ru',
        level: 0,
    };

    static _elements = {
        balance: '',
        control_panel: '',
        display: '',
        label_checkBox: '',
        leafable: '',
        popup: '',
        popup__button: '',
        popup__content: '',
        repeater_level: '',
        repeater_slider: '',
        root: '',
        slider: '',
        slider__container: '',
    };

    static _eventListeners_elements = {
        control_panel: {
            pointerdown: '_control_panel__on_pointerDown',
        },
        label_checkBox: {
            click: '_label_checkBox__on_click',
            pointerdown: '_label_checkBox__on_pointerDown',
        },
        repeater_level: {
            add: '_repeater_level__on_add',
            define: '_repeater_level__on_add',
            pointerdown: '_repeater_level__on_pointerDown',
        },
        repeater_slider: {
            add: '_repeater_slider__on_add',
            define: '_repeater_slider__on_add',
        },
        popup__button: {
            pointerdown: '_popup_button__on_pointerDown',
        },
        root: {
            touchstart: '_root__on_touchStart',
        },
        slider__container: {
            pointerdown: '_slider__on_pointerDown',
        },
    };

    static Repeater_level_manager = class extends Components.Repeater.Manager {
        _level = null;
        _level_status = null;


        data__apply() {
            this._level.innerHTML += this._model_item.level;
            this._level_status.statuses_values.sale.text = this._model_item.level_price || 0;
            this._level_status.status = this._model_item.level_status;
            this._level_status.meta_data = {product_name: this._model_item.level.split(' ')[0]};
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
            this._hero_status.meta_data = {product_name: this._model_item.hero_name};
            this._hero_status.statuses_values.sale.text = this._model_item.hero_price || 0;
            this._hero_status.statuses_values.sold.text = 'Выбрать';
            this._hero_status.statuses_values.sold.interface_name = 'shopButton__choice';
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


    _rest = new RestClient(new URL('./Packages/Backend/Manager/Manager', location));
    _translator = new Replacement();


    get balance() {
        return this._attributes.balance;
    }
    set balance(balance) {
        this._attribute__set('balance', balance);
        this._elements.balance.textContent = balance;
    }

    get language() {
        return this._attributes.language;
    }
    set language(language) {
        this._attribute__set('language', language);
        this._translator.replace_object = language;
        this._translator.replace(this._elements.root);
    }

    get level() {
        return this._attributes.level;
    }
    set level(level) {
        this._attribute__set('level', level);
    }


    _buy__commit(buy) {
        switch (buy.status) {
            case 'sale':
                if (buy.statuses_values.sale.text > this.balance) {
                    this._elements.popup__content.textContent = User_messages_enums[this.language].balance_deficit;
                    this._elements.popup.open();

                    break;
                }

                this._hero__buy(buy);
                break;
            case 'sold':
                this._hero__replace(buy);
                break;
        }
    }

    _control_panel__on_pointerDown(event) {
        if (!!this._elements.leafable._animation_end) return;

        let button = event.target.classList.contains('panel_button') ? event.target : event.target.parentElement;

        if (!button.classList.contains('panel_button')) return;

        let button_prev = this._elements.control_panel.children[2 - button.dataset.index];
        this._elements.leafable.index = button.dataset.index;
        this.refresh();

        button_prev.removeAttribute('active');
        button.setAttribute('active', true);
    }

    async _hero__buy(hero) {
        let hero_name = hero.meta_data.product_name;
        let result = await this._request__exec('hero__buy', hero_name)

        if (!result) return;

        this._hero__replace(hero, false);
    }

    async _hero__replace(hero, checked = true) {
        if (checked) {
            let hero_name = hero.meta_data.product_name;
            let result = await this._request__exec('hero__replace', hero_name)

            if (!result) return;
        }

        for (let child of this._elements.slider.children) {
            let hero_status = child.querySelector('.hero_status');
            if (hero_status.status != 'selected') continue;
            hero_status.status = 'sold';
        }

        hero.status = 'selected';
    }

    _init() {
        this.props__sync();
        this._elements.repeater_level.Manager = this.constructor.Repeater_level_manager;
        this._elements.repeater_slider.Manager = this.constructor.Repeater_slider_manager;
        // this._elements.root.addEventListener('touchstart', (event) => event.preventDefault());


        this.data__insert(
            [
                {
                    level: '1 уровень',
                    level_status: 'sold',
                },
                {
                    level: '2 уровень',
                    level_status: 'selected',
                },
                {
                    level: '3 уровень',
                    level_status: 'sale',
                    level_price: 100000
                },
                {
                    level: '4 уровень',
                    level_status: 'sale',
                    level_price: 100001
                },
                {
                    level: '5 уровень',
                    level_status: 'sale',
                    level_price: 100002
                },
                {
                    level: '6 уровень',
                    level_status: 'sale',
                    level_price: 100003
                },
                {
                    level: '7 уровень',
                    level_status: 'sale',
                    level_price: 100004
                },
                {
                    level: '8 уровень',
                    level_status: 'sale',
                    level_price: 100005
                },
                {
                    level: '9 уровень',
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

        // this._translator.replace_object = 'ru';
        // this._translator.replace(this._elements.root);
    }

    _label_checkBox__on_click(event) {
        event.preventDefault();
    }

    _label_checkBox__on_pointerDown(event) {
        event.preventDefault();
        this._elements.label_checkBox.checked = !this._elements.label_checkBox.checked;
    }

    _popup_button__on_pointerDown() {
        this._elements.popup.close();
    }

    _repeater_level__on_add() {
        this.refresh();
    }

    _repeater_level__on_pointerDown(event) {
        let button = event.target.classList.contains('level_status') ? event.target : event.target.parentElement;

        if (!button.classList.contains('level_status') || button.status != 'sale') return;

        if (button.meta_data.product_name - this.level != 1) {
            this._elements.popup__content.textContent = User_messages_enums[this.language].level_buy_failed;
            this._elements.popup.open();

            return;
        }
    }

    _repeater_slider__on_add(event) {
        this._elements.slider.index = 0;
        this.refresh();
    }

    async _request__exec(method, ...args) {
        let {error, exception, result} = await this._rest.call(method, Telegram.user?.id, ...args);

        if (exception) {
            this._elements.popup__content.textContent = User_messages_enums[this.language][exception];
            this._elements.popup.open();

            return;
        }

        return result;
    }

    _root__on_touchStart(event) {
        event.preventDefault();
    }

    _slider__on_pointerDown(event) {
        if (event.target.classList.contains('slider_arrow')) {
            let increment = event.target.classList.contains('slider_arrow_next') ? 1 : -1;

            this._elements.slider.animation_implicit_direction = -increment;
            this._elements.slider.index += increment;
        }
        else if (event.target.classList.contains('hero_status')) {
            this._buy__commit(event.target);
        }
        else if (event.target.parentElement.classList.contains('hero_status')) {
            this._buy__commit(event.target.parentElement);
        }
    }


    data__insert(levels_shop, heros_shop) {
        this._elements.repeater_level.model.clear();
        this._elements.repeater_slider.model.clear();
        this._elements.repeater_level.model.add(levels_shop);
        this._elements.repeater_slider.model.add(heros_shop);
    }

    refresh() {
        this._elements.display.refresh();
        this._elements.leafable.refresh();
        this._elements.slider.refresh();
    }
}
