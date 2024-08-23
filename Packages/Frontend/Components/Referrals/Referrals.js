import {Components} from '../../../Global/Frontend/Frontend.js';

import {ButtonBack} from '../ButtonBack/ButtonBack.js';
import {Referral} from '../Referral/Referral.js';


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
    };

    static _elements = {
        repeater: '',
        display: '',
        sort_buttons_referrals: '',
        sort_buttons_date: '',
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


    _init() {
        this._elements.repeater.Manager = this.constructor.Repeater_manager;
        this.data_insert();
        this.props__sync();
    }

    _repeater__on_add() {
        this.refresh();
    }

    _sort_buttons_date__on_pointerDown(event) {
        if (!event.target.dataset.type) return;

        this._date = event.target.dataset.type;
    }

    _sort_buttons_referrals__on_pointerDown(event) {
        if (!event.target.dataset.type) return;

        this._score = event.target.dataset.type;
    }

    // _date_buttons_referrals__on_pointerDown(event) {
    //     if (!event.target.dataset.type) return;

    //     this._date = event.target.dataset.type;
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
