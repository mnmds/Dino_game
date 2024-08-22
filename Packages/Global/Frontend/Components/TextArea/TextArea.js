// 23.04.2024


import {Flickable} from '../Flickable/Flickable.js';
import {TextInput} from '../TextInput/TextInput.js';


export class TextArea extends TextInput {
    static _components = [Flickable];
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        spellCheck: false,
    };

    static _elements = {
        input: '',
        root: '',
    };

    static _eventListeners = {
        ...super._eventListeners,

        window: {
            resize: '_window__on_resize',
        },
    };

    static _eventListeners_elements = {
        input: {
            beforeinput: '_input__on_beforeInput',
            input: '_input__on_input',
        },
    };


    static {
        this.init();
    }


    _input_scrollHeight_prev = 0;
    _input_scrollWidth_prev = 0;


    get spellCheck() {
        return this._attributes.spellCheck;
    }
    set spellCheck(spellCheck) {
        this._attribute__set('spellCheck', spellCheck);
        this._elements.input.spellcheck = this.spellCheck;
    }

    get value() {
        return this._elements.input.value;
    }
    set value(value) {
        this._elements.input.value = value;
        this.refresh();
    }


    _height__define() {
        this.constructor.height_outer__set(this._elements.input, 1);
        let height = this._elements.input.scrollHeight + this._elements.root.css_numeric__get('padding-bottom') + this._elements.root.css_numeric__get('padding-top');
        this.height_inner__set(height);
        this.constructor.height_outer__set(this._elements.input);
    }

    _init() {
        this._element = this._elements.input;
        super._init();

        this.props__sync('spellCheck');
        this.constructor.eventListeners__apply(window, this._eventListeners.window);
        this.refresh(false);
    }

    _input__on_beforeInput() {
        this._input_scrollHeight_prev = this._elements.input.scrollHeight;
        this._input_scrollWidth_prev = this._elements.input.scrollWidth;
    }

    _input__on_input() {
        this._height__define();
        this.event__dispatch('input');

        if (this._elements.input.scrollHeight == this._input_scrollHeight_prev && this._elements.input.scrollWidth == this._input_scrollWidth_prev) return;

        this._elements.root.refresh();
        this.event__dispatch('resize');
    }

    _refresh() {
        this._height__define();
        this._elements.root.refresh();
    }

    _window__on_resize() {
        this.refresh(false);
    }
}
