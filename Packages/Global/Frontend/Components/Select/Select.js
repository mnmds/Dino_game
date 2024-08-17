// 07.07.2024


import {Component} from '../Component/Component.js';
import {TextField} from '../TextField/TextField.js';
import {Flickable} from '../Flickable/Flickable.js';
import {Popup} from '../Popup/Popup.js';
import {Repeater} from '../Repeater/Repeater.js';


export class Select extends Component {
    static _components = [TextField, Flickable, Repeater];
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        editable: false,
        // open: false,
    };

    static _elements = {
        textField: '',
        flickable: '',
        list: '',
        popup: '',
        repeater: '',
    };

    static _eventListeners_elements = {
        repeater: {
            define: '_repeater__on_define',
        },

        // textField: {
        //     blur: (event) => console.log('blur', event, event.target),
        //     focus: (event) => console.log('focus', event, event.target),
        // },
        // popup: {
        //     blur: (event) => console.log('blur', event, event.target),
        //     focus: (event) => console.log('focus', event, event.target),
        // },
    };

    static _eventListeners_target = {
    // static _eventListeners_shadow = {
        focusin: '_on_focusIn',
        focusout: '_on_focusOut',
        pointerdown: '_on_pointerDown',
    };


    static {
        this.init();
    }


    get editable() {
        return this._attributes.editable;
    }
    set editable(editable) {
        this._attribute__set('editable', editable);
        this._elements.textField.disabled = !this.editable;
        this._elements.textField.inert = !this.editable;
    }

    // get open() {
    //     return this._attributes.open;
    // }
    // set open(open) {
    //     this._attribute__set('open', open);
    // }


    _init() {
        this._elements.repeater.delegate = this.querySelector('[Select__delegate]') || this._elements.repeater.delegate;
        this._elements.repeater.model = this.querySelector('[Select__model]') || this._elements.repeater.model;
        this._elements.repeater.target = this;
        this.props__sync('editable');
        this.refresh();

        this._elements.textField.value = 'Item_0';

        // console.log(this, this.children)

        let wrapper = this.constructor.wrap(this.children);
        wrapper.tabIndex = -1;
    }

    _on_focusIn(event) {
        // if (event.relatedTarget == this._elements.textField || event.relatedTarget == this._elements.popup) return;
        // console.log('Select._on_focusIn', event, event.target, event.relatedTarget)

        this._elements.popup.open();
        this._elements.flickable.refresh();
        // this._elements.textField.focus();
        // setTimeout(() => this._elements.textField.focus());

    }

    _on_focusOut(event) {
        // if (event.relatedTarget == this._elements.textField || event.relatedTarget == this._elements.popup) return;
        // console.log('Select._on_focusOut', event, event.target, event.relatedTarget)

        if (this.contains(event.relatedTarget) || this._shadow.contains(event.relatedTarget)) return;

        this._elements.textField.blur();
        this._elements.popup.close();
    }

    _on_pointerDown() {
        // this._elements.popup.open();
    }

    _repeater__on_define() {
        this._elements.flickable.refresh();
    }


    async refresh() {
        await this._elements.repeater.refresh();
        this._elements.flickable.refresh();
    }
}
