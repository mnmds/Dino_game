import {Components} from '../../../Global/Frontend/Frontend.js';
import {RestClient} from '../../../Global/Js/Js.js';

import {Main} from '../Main/Main.js';
import {Game} from '../Game/Game.js';
import {Referrals} from '../Referrals/Referrals.js';
import {Settings} from '../Settings/Settings.js';
import {Shop} from '../Shop/Shop.js';
import {Quests} from '../Quests/Quests.js';


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
    };

    static _elements = {
        leafable: '',
        settings: '',
        main: '',
        quests: '',
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


    _init() {
        this.user_get();
    }

    _on__back_click() {
        this._elements.leafable.index = 0;
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
        if (!Units.Telegram.user?.id) return;

        let {result} = await this._rest.call('user_get', Units.Telegram.user.id);

        if (!result) return;

        this._elements.main.level_value = result.level;
        this._elements.main.balance = result.balance;
        this._elements.main.energy = result.energy;

        this._elements.quests.data_insert(result.quests);
        this._elements.quests._elements.timer.start();

        this._elements.shop.data__insert(result.shop);
    }
}
