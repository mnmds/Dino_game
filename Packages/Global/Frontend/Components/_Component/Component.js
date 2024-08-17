import {Component} from '../Component/Component.js';


export class Component_new extends Component {
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
