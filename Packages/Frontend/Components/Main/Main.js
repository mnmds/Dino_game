import {Components} from '../../../Global/Frontend/Frontend.js';
import {RestClient} from '../../../Global/Js/Js.js';
import {Game} from '../Game/Game.js';
import {Timer} from '../Timer/Timer.js';


export class Main extends Components.Component {
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _components = [
        Game,
        Timer,
    ];

    static _attributes = {
        ...super._attributes,
    };

    static _elements = {
        income_value: '',
        level_value: '',
        settings: '',
        referrals: '',
        quests: '',
        shop: '',
    };

    _rest = new RestClient(new URL('./Packages/Backend/Manager/Manager.php', location));

    static _eventListeners_elements = {
        settings: {
            pointerdown: '_settings__on_pointerDown',
        },
        referrals: {
            pointerdown: '_referrals__on_pointerDown',
        },
        quests: {
            pointerdown: '_quests__on_pointerDown',
        },
        shop: {
            pointerdown: '_shop__on_pointerDown',
        },
    };

    async _settings__on_pointerDown() {
        this.event__dispatch('menu_click', {page: 4}, {composed: true});
    }

    async _referrals__on_pointerDown() {
        this.event__dispatch('menu_click', {page: 3}, {composed: true});
    }

    async _quests__on_pointerDown() {
        this.event__dispatch('menu_click', {page: 2}, {composed: true});
    }

    async _shop__on_pointerDown() {
        this.event__dispatch('menu_click', {page: 1}, {composed: true});
    }


    static {
        this.init();
    }

    _init() {
    }
}
