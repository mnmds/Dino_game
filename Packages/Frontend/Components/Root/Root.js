import {Components} from '../../../Global/Frontend/Frontend.js';
import {RestClient} from '../../../Global/Js/Js.js';

import {Main} from '../Main/Main.js';
import {Game} from '../Game/Game.js';
import {Referrals} from '../Referrals/Referrals.js';
import {Settings} from '../Settings/Settings.js';
import {Shop} from '../Shop/Shop.js';
import {Quests} from '../Quests/Quests.js';
import {Units} from '../../../Global/Frontend/Frontend.js';


export class Root extends Components.Viewport {
    static _components = [
        Components.Leafable,
        Quests,
        Game,
        Referrals,
        Settings,
        Shop,
        Main,
    ];

    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        _time_last_request: 0,

        limit_time__requests: {
            default: 1e4,
            persistent: true,
            range: [0, Infinity],
        },
    };

    static _elements = {
        leafable: '',
        main: '',
        quests: '',
        referrals: '',
        settings: '',
        shop: '',
    };

    static _eventListeners_elements = {
        main: {
            menu_click: '_on__menu_click',
        },
        settings: {
            language__toggle: '_settings__on_languageToggle',
        },
    };

    static _eventListeners_target = {
        back_click: '_on__back_click',
    };


    static {
        this.init();
    }

    _rest = new RestClient(new URL('./Packages/Backend/Manager/Manager', location));
    _user_data = {};


    get _time_last_request() {
        return this._attributes._time_last_request;
    }
    set _time_last_request(time_last_request) {
        this._attribute__set('_time_last_request', time_last_request);
    }


    get limit_time__requests() {
        return this._attributes.limit_time__requests;
    }
    set limit_time__requests(limit_time__requests) {
        this._attribute__set('limit_time__requests', limit_time__requests);
    }


    _data__apply() {
        this._elements.main.level_value = this._user_data.level;
        this._elements.main.balance = this._user_data.balance;
        this._elements.main.energy = Math.trunc(this._user_data.energy);
        this._elements.main.hero = this._user_data.hero_name;

        this._elements.quests.data_insert(this._user_data.quests);
        // this._elements.quests._elements.timer.start();

        this._elements.shop.data__insert(this._user_data.shop);
        this._elements.shop.balance = this._user_data.balance;
        this._elements.shop.offline_delivery = this._user_data.offline_delivery;
        this._elements.shop.level = this._user_data.level;

        this._elements.referrals.constructor.referrals = this._user_data.referrals;
        this._elements.referrals.refresh();

        this._elements.settings.newsletter = this._user_data.newsletter;
    }

    async _init() {
        // alert(import.meta.url)
        await this.user_get();
    }

    _on__back_click() {
        this._elements.leafable.index = 0;
        this.user_get();
    }

    _on__menu_click(event) {
        // console.log(event.detail.page);
        this.user_get();
        this._elements.leafable.index = event.detail.page;
        this._elements.leafable.children[event.detail.page].refresh?.();
    }

    _settings__on_languageToggle(event) {
        for (let child of this._elements.leafable.children) {
            child.language = event.detail.language;
        }
    }


    async user_get() {
        let is__time_requests = this._time_last_request ? (Date.now() - this._time_last_request) > this.limit_time__requests : true;

        if (!Units.Telegram.user?.id || !is__time_requests) return;

        let {result} = await this._rest.call('user_get', Units.Telegram.user?.id);

        if (!result) return;

        this._user_data = result;
        this._time_last_request = Date.now();
        this._data__apply();
    }
}
