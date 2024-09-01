import {Components} from '../../Global/Frontend/Frontend.js';


export class Copying extends Components.Component {
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        _active: false,

        animation_time: 2e3,
        text: '',
        text_copy: '',
    };

    static _elements = {
        field: '',
        root: '',
    };

    static _eventListeners_target = {
        pointerdown: '_on__pointerDown',
    };

    static {
        this.init();
    }


    get _active() {
        return this._attributes._active;
    }
    set _active(active) {
        this._attribute__set('_active', !!active);
    }


    get animation_time() {
        return this._attributes.animation_time;
    }
    set animation_time(animation_time) {
        this._attribute__set('animation_time', animation_time);
    }

    get text() {
        return this._attributes.text;
    }
    set text(text) {
        this._attribute__set('text', text);
        this._elements.field.textContent = text;
    }

    get text_copy() {
        return this._attributes.text_copy;
    }
    set text_copy(text_copy) {
        this._attribute__set('text_copy', text_copy);
    }


    _active__toggle() {
        this._active = !this._active;
    }

    _on__pointerDown() {
        if (this._active || !this.text_copy) return;

        navigator.clipboard.writeText(this.text_copy).then(() => {
            this._active__toggle();
            setTimeout(this._active__toggle.bind(this), this.animation_time);
        });
    }
}
