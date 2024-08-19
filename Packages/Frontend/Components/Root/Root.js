import {Components} from '../../../Global/Frontend/Frontend.js';

import {Shop} from '../Shop/Shop.js';


export class Root extends Components.Viewport {
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,
    };

    static _elements = {};

    static _eventListeners = {};


    static {
        this.init();
    }


    _init() {

    }
}
