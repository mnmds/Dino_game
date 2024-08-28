import {Components} from '../../../Global/Frontend/Frontend.js';


export class ButtonBack extends Components.Component {
    static _components = [Components.Svg];
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,
    };

    static _eventListeners_target = {
        pointerdown: '_on__pointerDown'
    };


    static {
        this.init();
    }


    _on__pointerDown() {
        this.event__dispatch('back_click', {/*Параметр key: value*/}, {composed: true});
    }
}
