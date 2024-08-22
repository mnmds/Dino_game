import {Components} from '../../../Global/Frontend/Frontend.js';

import {Settings} from '../Settings/Settings.js';
import {Shop} from '../Shop/Shop.js';
import {Game} from '../Game/Game.js';


export class Root extends Components.Viewport {
    static _components = [
        Components.Leafable,
        Game,
        Settings,
        Shop,
    ];

    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,
    };

    static _elements = {
        leafable: '',
    };

    static _eventListeners_target = {
        back_click: '_on__back_click',
    };


    static {
        this.init();
    }


    _init() {}

    _on__back_click() {
        this._elements.leafable.index = 0;
    }
}
