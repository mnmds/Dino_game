import {Component} from '../Component/Component.js';


export class Switch extends Component {
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        _animation: false,


        animation_implicit: false,
        disabled: false,
        on: false,
        vertical: false,
    };

    static _eventListeners_target = {
        pointerdown: '_on_pointerDown',
        transitionend: '_on_transitionEnd',
    };


    static {
        this.init();
    }


    get _animation() {
        return this._attributes._animation;
    }
    set _animation(animation) {
        this._attribute__set('_animation', animation);
    }


    get animation_implicit() {
        return this._attributes.animation_implicit;
    }
    set animation_implicit(animation_implicit) {
        this._attribute__set('animation_implicit', animation_implicit);
    }

    get disabled() {
        return this._attributes.disabled;
    }
    set disabled(disabled) {
        this._attribute__set('disabled', disabled);
    }

    get on() {
        return this._attributes.on;
    }
    set on(on) {
        this._attribute__set('on', on);
        this._animation ||= this.animation_implicit;
    }

    get vertical() {
        return this._attributes.vertical;
    }
    set vertical(vertical) {
        this._attribute__set('vertical', vertical);
    }


    _on_pointerDown() {
        if (this.disabled) return;

        this._animation = true;
        this.toggle();

        this.event__dispatch('toggle');
    }

    _on_transitionEnd() {
        this._animation = false;
    }


    toggle() {
        this.on = !this.on;
    }
}
