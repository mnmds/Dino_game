// 13.07.2024


import {Component} from '../Component/Component.js';


export class Popup extends Component {
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        mode: {
            default: '',
            enum: ['lite', 'modal'],
        },
    };

    static _elements = {
        slot: '',
    };

    static _eventListeners_elements = {
        slot: {
            slotchange: '_slot__on_slotChange',
        }
    };

    static _eventListeners_target = {
        close: '_target__on_close',
        focusin: '_target__on_focusIn',
        focusout: '_target__on_focusOut',
        keydown: '_target__on_keyDown',
        pointerdown: '_target__on_pointerDown',
    };


    static {
        this.init();
    }


    _focused = false;


    get mode() {
        return this._attributes.mode;
    }
    set mode(mode) {
        this._attribute__set('mode', mode);
    }


    _content__wrap() {
        if (this.firstElementChild?.getAttribute('tabIndex')) return;

        let nodes = this._elements.slot.assignedNodes();

        if (!nodes.length) return;

        let wrapper = this.constructor.wrap(nodes, 'div');
        wrapper.tabIndex = -1;
    }

    _init() {
        this._content__wrap();
    }

    _target__on_close() {
        this.event__dispatch('close');
    }

    _target__on_focusIn(event) {
        this._focused = true;
    }

    _target__on_focusOut(event) {
        if (this.mode != 'lite' || this.contains(event.relatedTarget) || this._shadow.contains(event.relatedTarget)) return;

        this._focused = false;
        this.close();
    }

    _target__on_keyDown(event) {
        if (this.mode != 'lite' || event.code != 'Escape') return;

        this.close();
    }

    _target__on_pointerDown(event) {
        event.stopPropagation();
    }

    _slot__on_slotChange() {
        this._content__wrap();
    }


    close() {
        if (this.mode == 'lite') {
            this._target.close();
        }
        else if (this.mode == 'modal') {
            this._target.close();
        }
        else {
            this._target.open = false;
        }
    }

    open() {
        if (this.mode == 'lite') {
            this._target.show();
            this._target.focus();

            if (!this._focused) {
                this.close();
            }
        }
        else if (this.mode == 'modal') {
            this._target.showModal();
        }
        else {
            this._target.open = true;
        }
    }
}
