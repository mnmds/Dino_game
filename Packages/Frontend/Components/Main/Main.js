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

        balance: 0,
        energy: 0,
        hero: 'Dino',
        language: 'ru',
        level_value: 1,
        time: 0,
    };

    static _elements = {
        balance: '',
        energy: '',
        game: '',
        income_value: '',
        level_value: '',
        max_energy: '',
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
    };

    static _eventListeners_elements = {
        game: {
            data__ping: '_game__on_dataPing',
        },
        quests: {
            pointerdown: '_quests__on_pointerDown',
        },
        referrals: {
            pointerdown: '_referrals__on_pointerDown',
        },
        settings: {
            pointerdown: '_settings__on_pointerDown',
        },
        shop: {
            pointerdown: '_shop__on_pointerDown',
        },
    };


    static {
        this.init();
    }


    _profit_temp = 0;


    get level_value() {
        return this._attributes.level_value;
    }
    set level_value(level_value) {
        this._attribute__set('level_value', level_value);
        this._elements.level_value.textContent = level_value;
        this._elements.income_value.textContent = level_value;
        this._elements.max_energy.textContent = level_value * 1000;
        this._elements.game.level = level_value;
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

    get language() {
        return this._attributes.language;
    }
    set language(language) {
        this._attribute__set('language', language);
        this._translator.replace_object = language;
        this._translator.replace(this._elements.root);
    }

    get hero() {
        return this._attributes.hero;
    }
    set hero(hero) {
        this._attribute__set('hero', hero);
        this._elements.game.hero = hero;
    }


    _rest = new RestClient(new URL('./Packages/Backend/Manager/Manager.php', location));
    _translator = new Replacement();


    _game__on_dataPing(event) {
        this.balance += event.detail.profit - this._profit_temp;
        this.energy = Math.trunc(event.detail.energy);
        this._profit_temp = event.detail.profit;
    }

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
