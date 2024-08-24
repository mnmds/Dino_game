import {Components} from '../../../Global/Frontend/Frontend.js';

import {Game} from '../Game/Game.js';
import {Referrals} from '../Referrals/Referrals.js';
import {Settings} from '../Settings/Settings.js';
import {Shop} from '../Shop/Shop.js';


export class Root extends Components.Viewport {
    static _components = [
        Components.Leafable,
        Game,
        Referrals,
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
        settings: '',
    };

    static _eventListeners_elements = {
        settings: {
            language__toggle: '_settings__on_languageToggle',
        }
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

    _settings__on_languageToggle(event) {
        for (let child of this._elements.leafable.children) {
            child.language = event.detail.language;
        }
    }
}
