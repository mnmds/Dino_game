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
    };

    _rest = new RestClient(new URL('./Packages/Backend/Manager/Manager.php', location));

    static _eventListeners_elements = {
        settings: {
            pointerdown: '_settings__on_pointerDown',
        }
    };

    async _settings__on_pointerDown() {
        this.event__dispatch('menu_click', {page: 4}, {composed: true});
    }


    static {
        this.init();
    }

    _init() {
    }
}
