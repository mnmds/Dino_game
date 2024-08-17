import {Component} from '../Component/Component.js';


export class CheckBox extends Component {
    static _css_url = true;
    static _elements = {};
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,
    };


    static {
        this.init();
    }


    _init() {

    }
}
