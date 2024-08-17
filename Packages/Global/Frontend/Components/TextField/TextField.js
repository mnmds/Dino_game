// 10.04.2024


import {TextInput} from '../TextInput/TextInput.js';


export class TextField extends TextInput {
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        _invalid: false,
        _notEmpty: false,


        button_clear: false,
        button_mask: false,
        length_max: {
            default: Infinity,
            range: [0, Infinity],
        },
        mask_char: '●',
        masked: false,
        regExp: '',
        template: '',
        template_char: '_',
    };

    static _elements = {
        button_clear: '',
        button_mask: '',
        input: '',
    };

    static _eventListeners_elements = {
        button_clear: {
            pointerdown: '_button_clear__on_pointerDown',
        },
        button_mask: {
            pointerdown: '_button_mask__on_pointerDown',
        },
        input: {
            beforeinput: '_input__on_beforeInput',
            compositionend: '_input__on_compositionEnd',
            compositionstart: '_input__on_compositionStart',
            input: '_input__on_input',
        },
    };

    static _interpolations = {
        url: this._url,
    };


    static {
        this.init();
    }


    _chars = [];
    _event_data = '';
    _input_value = '';
    _regExp = new RegExp();
    _selection_begin = -1;
    _selection_end = -1;
    _value = '';


    get _invalid() {
        return this._attributes._invalid;
    }
    set _invalid(invalid) {
        this._attribute__set('_invalid', invalid);
    }

    get _notEmpty() {
        return this._attributes._notEmpty;
    }
    set _notEmpty(notEmpty) {
        this._attribute__set('_notEmpty', notEmpty);
    }


    get button_clear() {
        return this._attributes.button_clear;
    }
    set button_clear(button_clear) {
        this._attribute__set('button_clear', button_clear);
    }

    get button_mask() {
        return this._attributes.button_mask;
    }
    set button_mask(button_mask) {
        this._attribute__set('button_mask', button_mask);
    }

    get length_max() {
        return this._attributes.length_max;
    }
    set length_max(length_max) {
        this._attribute__set('length_max', length_max);
    }

    get mask_char() {
        return this._attributes.mask_char;
    }
    set mask_char(mask_char) {
        if (mask_char != null) {
            mask_char = this._string_chars__get(mask_char + '')[0];
        }

        this._attribute__set('mask_char', mask_char);

        if (this.masked) {
            this._elements.input.value = this._value_masked__get();
        }
    }

    get masked() {
        return this._attributes.masked;
    }
    set masked(masked) {
        this._attribute__set('masked', masked);
        this.value = this.value;
    }

    get regExp() {
        return this._regExp;
    }
    set regExp(regExp) {
        if (regExp instanceof RegExp) {
            this._regExp = regExp;
            this._attribute__set('regExp', this._regExp.toString().replace(/^\/|\/\w*$/g, ''));
        }
        else {
            regExp ??= '';
            this._regExp = new RegExp(regExp);
            this._attribute__set('regExp', regExp);
        }
    }

    get template() {
        return this._attributes.template;
    }
    set template(template) {
        this._attribute__set('template', template);
    }

    get template_char() {
        return this._attributes.template_char;
    }
    set template_char(template_char) {
        template_char = this._string_chars__get(template_char + '')[0];
        this._attribute__set('template_char', template_char);
    }

    get value() {
        return this._value;
    }
    set value(value) {
        this._value = value + '';
        this._chars = this._string_chars__get(this.value);
        this._elements.input.value = this.masked ? this._value_masked__get() : this.value;

        this._invalid = false;
        this._notEmpty = !!this.value;
    }


    _button_clear__on_pointerDown(event) {
        event.preventDefault();

        this.value = '';
    }

    _button_mask__on_pointerDown(event) {
        event.preventDefault();

        this.masked = !this.masked;
    }

    _init() {
        this._element = this._elements.input;
        this.props__sync('mask_char', 'regExp', 'template_char');
        super._init();
    }

    _input__on_beforeInput(event) {
        if (event.inputType.startsWith('history')) return;

        if (event.inputType == 'insertCompositionText') {
            event.preventDefault();

            return;
        }

        this._event_data = event.data;
        this._input_state__refresh();
    }

    _input__on_compositionEnd(event) {
        if (!event.data) return;

        this._value__change(event.data, event.inputType);
    }

    _input__on_compositionStart() {
        this._input_state__refresh();
    }

    _input__on_input(event) {
        if (event.inputType == 'insertCompositionText') return;

        this._value__change(this._event_data, event.inputType);
    }

    _input_state__refresh() {
        this._input_value = this._elements.input.value;
        this._selection_begin_prev = this._selection_begin;
        this._selection_end_prev = this._selection_end;
        this._selection_begin = this._elements.input.selectionStart;
        this._selection_end = this._elements.input.selectionEnd;
    }

    _string_chars__get(string, position_begin = 0, position_end = undefined) {
        return string?.slice(position_begin, position_end).match(/\p{RGI_Emoji}|./gv) || [];
    }

    _value__change(data, inputType = '') {
        let input_chars_left = this._string_chars__get(this._input_value, 0, this._selection_begin);
        let input_chars_right = this._string_chars__get(this._input_value, this._selection_end);
        let chars_left = this._chars.slice(0, input_chars_left.length);
        let chars_right = this._chars.slice(this._chars.length - input_chars_right.length);

        if (this._selection_begin == this._selection_end) {
            if (inputType == 'deleteContentBackward') {
                chars_left.pop();
            }
            else if (inputType == 'deleteContentForward') {
                chars_right.shift();
            }
            else if (this._chars.length >= this.length_max) {
                data = '';
            }
        }

        chars_left.push(...this._string_chars__get(data));
        this.value = [...chars_left, ...chars_right].slice(0, this.length_max).join('');
        this._elements.input.selectionStart = this.masked ? chars_left.length * this.mask_char.length : chars_left.join('').length;
        this._elements.input.selectionEnd = this._elements.input.selectionStart;
    }

    _value_masked__get() {
        return Array(this._chars.length + 1).join(this.mask_char);
    }


    validate() {
        let valid = this.regExp.test(this.value);
        this._invalid = !valid;

        return valid;
    }
}
