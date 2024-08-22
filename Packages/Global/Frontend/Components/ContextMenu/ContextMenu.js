import {Popup} from '../Popup/Popup.js';


export class ContextMenu extends Popup {
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,
    };

    static _elements = {
        ...super._elements,
    };

    static _eventListeners = {};


    static {
        this.init();
    }


    _init() {

    }
}
