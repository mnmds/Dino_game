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
        income: '',
        income: '',
        income: '',
        income: '',
        income: '',
        income: '',
    };

    _rest = new RestClient(new URL('./Packages/Backend/Manager/Manager', location));

    static _eventListeners_elements = {

    };


    static {
        this.init();
    }

    _init() {
    }
}
