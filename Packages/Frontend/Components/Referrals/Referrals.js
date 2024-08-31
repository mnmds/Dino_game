import {Components} from '../../../Global/Frontend/Frontend.js';

import {Replacement} from '../../Units/Units.js';
import {Units} from '../../../Global/Frontend/Frontend.js';
import {ButtonBack} from '../ButtonBack/ButtonBack.js';
import {Referral} from '../Referral/Referral.js';
import {RestClient} from '../../../Global/Js/Js.js';


export class Referrals extends Components.Component {
    static _components = [
        ButtonBack,
        Components.Flickable,
        Components.Repeater,
        Referral,
    ];

    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        _date: {
            default: 'all_time',
            persistent: true,
        },
        _score: {
            default: 'referral',
            persistent: true,
        },

        language: 'ru',
    };

    static _elements = {
        display: '',
        repeater: '',
        root: '',
        sort_buttons_date: '',
        sort_buttons_referrals: '',
        referral_button: '',
    };

    static _eventListeners_elements = {
        repeater: {
            add: '_repeater__on_add',
            define: '_repeater__on_add',
        },
        sort_buttons_date: {
            pointerdown: '_sort_buttons_date__on_pointerDown',
        },
        sort_buttons_referrals: {
            pointerdown: '_sort_buttons_referrals__on_pointerDown',
        },
        referral_button: {
            pointerdown: '_referral_button__on_pointerDown'
        },
    };

    static Repeater_manager = class extends Components.Repeater.Manager {
        data__apply() {
            this._item.date = this._model_item.user_date;
            this._item.image_url = this._model_item.image_url;
            this._item.index = this._model_item.user_index;
            this._item.name = this._model_item.user_name;
            this._item.score = this._model_item.user_score;
        }

        init() {
            this.data__apply();
        }
    };


    static {
        this.init();
    }


    _translator = new Replacement();


    referrals = [];


    get _date() {
        return this._attributes._date;
    }
    set _date(date) {
        this._attribute__set('_date', date);
    }

    get _score() {
        return this._attributes._score;
    }
    set _score(score) {
        this._attribute__set('_score', score);
    }


    get language() {
        return this._attributes.language;
    }
    set language(language) {
        this._attribute__set('language', language);
        this._translator.replace_object = language;
        this._translator.replace(this._elements.root);
    }


    _init() {
        this._elements.repeater.Manager = this.constructor.Repeater_manager;
        this.data_insert();
        this.props__sync();
    }

    _repeater__on_add() {
        this.refresh();
    }

    _rest = new RestClient(new URL('./Packages/Backend/Manager/Manager', location));

    _sort_buttons_date__on_pointerDown(event) {
        if (!event.target.dataset.type) return;

        this._date = event.target.dataset.type;
    }

    async _sort_buttons_referrals__on_pointerDown(event) {
        if (!event.target.dataset.type) return;

        this._score = event.target.dataset.type;
        let {result} = await this._rest.call('referrals__get', Units.Telegram.user?.id, this._date, this._score)
    }



    // _date_buttons_referrals__on_pointerDown(event) {
    //     if (!event.target.dataset.type) return;

    //     this._date = event.target.dataset.type;
    // }

    // async _referral_button__on_pointerDown() {
    //     await this._rest.call('referrals__get', Units.Telegram.user.id);
    // }


    data_insert() {
        this._elements.repeater.model.clear();
        this._elements.repeater.model.add([
            {
                user_index: '123',
                image_url: '../referral/test_user_image.jpg',
                user_name: 'us',
                user_score: '232',
            },
            {
                user_index: '123',
                image_url: '../referral/test_user_image.jpg',
                user_name: 'us',
                user_score: '232',
            },
            {
                user_index: '123',
                image_url: '../referral/test_user_image.jpg',
                user_name: 'us',
                user_score: '232',
            },
            {
                user_index: '123',
                image_url: '../referral/test_user_image.jpg',
                user_name: 'us',
                user_score: '232',
            },
            {
                user_index: '123',
                image_url: '../referral/test_user_image.jpg',
                user_name: 'us',
                user_score: '232',
            },
            {
                user_index: '123',
                image_url: '../referral/test_user_image.jpg',
                user_name: 'us',
                user_score: '232',
            },
        ]);
    }

    refresh() {
        this._elements.display.refresh();
    }
}
