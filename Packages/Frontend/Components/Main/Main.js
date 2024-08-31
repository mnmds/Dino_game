import {Components} from '../../../Global/Frontend/Frontend.js';
import {RestClient} from '../../../Global/Js/Js.js';
import {Replacement} from '../../Units/Units.js';
import {Game} from '../Game/Game.js';
import {Timer} from '../Timer/Timer.js';


export class Main extends Components.Component {
    static _components = [Game, Timer];
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,
        language: 'ru',
        level_value: 1,
        balance: 0,
        energy: 0,
        time: 0,
    };

    static _elements = {
        quests: '',
        referrals: '',
        root: '',
        settings: '',
        shop: '',
        income_value: '',
        level_value: '',
        balance: '',
        energy: '',
        max_energy: '',
        timer: '',
    };

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


    static {
        this.init();
    }

    get level_value() {
        return this._attributes.level_value;
    }
    set level_value(level_value) {
        this._attribute__set('level_value', level_value);
        this._elements.level_value.textContent = `${level_value} уровень`;
        this._elements.income_value.textContent = level_value;
        this._elements.max_energy.textContent = level_value * 1000;
    }

    get balance() {
        return this._attributes.balance;
    }
    set balance(balance) {
        this._attribute__set('balance', balance);
        this._elements.balance.textContent = balance;
    }

    get energy() {
        return this._attributes.energy;
    }
    set energy(energy) {
        this._attribute__set('energy', energy);
        this._elements.energy.textContent = energy;
    }

    get time() {
        return this._attributes.time;
    }
    set time(time) {
        this._elements.timer.duration = time;
        this._elements.timer.start();
    }

    get language() {
        return this._attributes.language;
    }
    set language(language) {
        this._attribute__set('language', language);
        this._translator.replace_object = language;
        this._translator.replace(this._elements.root);
    }


    _rest = new RestClient(new URL('./Packages/Backend/Manager/Manager.php', location));
    _translator = new Replacement();


    _init() {
        this.props__sync();
    }

    _quests__on_pointerDown() {
        this.event__dispatch('menu_click', {page: 2});
    }

    _referrals__on_pointerDown() {
        this.event__dispatch('menu_click', {page: 3});
    }

    _settings__on_pointerDown() {
        this.event__dispatch('menu_click', {page: 4});
    }

    _shop__on_pointerDown() {
        this.event__dispatch('menu_click', {page: 1});
    }
}
