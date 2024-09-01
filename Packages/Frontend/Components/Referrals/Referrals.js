import {Components} from '../../../Global/Frontend/Frontend.js';
import {Units} from '../../../Global/Frontend/Frontend.js';

import {Replacement} from '../../Units/Units.js';
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
    static _key_parameter = 'referrals_count__this_week';
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        _date: {
            default: 'this_week',
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
        invite_button: '',
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
        invite_button: {
            pointerdown: '_invite_button__on_pointerDown',
        }
    };


    static referrals = [];

    static Repeater_manager = class extends Components.Repeater.Manager {
        data__apply() {
            this._item.image_url = this._model_item.image_url;
            this._item.index = Referrals.referrals.indexOf(this._model_item) + 1;
            this._item.name = this._model_item.user_name;
            this._item.score = this._model_item[Referrals._key_parameter];
        }

        init() {
            this.data__apply();
        }
    };

    static {
        this.init();
    }


    _translator = new Replacement();


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

    _invite_button__on_pointerDown() {
        let message = `https://t.me/gdtapbot?start=${Units.Telegram.user?.id}`;
        let url = `https://t.me/share/url?url=${encodeURIComponent(message)}&text=ПОМОГИ ГДЗАВРИКУ ДОСТАВИТЬ ГЕМЫ!`;
        Units.Telegram.link_telegram__open(url)
    }


    _init() {
        this._elements.repeater.Manager = this.constructor.Repeater_manager;
        this.props__sync();
    }

    _repeater__on_add() {
        this._elements.display.refresh();
    }

    _referrals__sort() {
        switch (this._date) {
            case 'this_week':
                this.constructor._key_parameter = this._score == 'referral' ? 'referrals_count__this_week' : 'week_balance';
                break;
            case 'last_week':
                this.constructor._key_parameter = this._score == 'referral' ? 'referrals_count__last_week' : 'week_prev_balance';
                break;
            case 'all_time':
                this.constructor._key_parameter = this._score == 'referral' ? 'referrals_count__all' : 'balance';
                break;
        }

        this.constructor.referrals.sort((item_prev, item_next) => item_next[this.constructor._key_parameter] - item_prev[this.constructor._key_parameter]);
    }

    _sort_buttons_date__on_pointerDown(event) {
        if (!event.target.dataset.type) return;

        this._date = event.target.dataset.type;
        this.refresh();
    }

    _sort_buttons_referrals__on_pointerDown(event) {
        if (!event.target.dataset.type) return;

        this._score = event.target.dataset.type;
        this.refresh();
    }


    data__insert(referrals) {
        this._elements.repeater.model.clear();
        this._elements.repeater.model.add(referrals);
    }

    refresh() {
        this._elements.display.refresh();
        this._referrals__sort();
        this.data__insert(this.constructor.referrals);
    }
}
