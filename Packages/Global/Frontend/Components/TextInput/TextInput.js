// 12.08.2024


import {Component} from '../Component/Component.js';


export class TextInput extends Component {
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        _focused: false,


        disabled: false,
        dragAndDrop: false,
        placeholder: '',
    };

    static _eventListeners = {
        element: {
            beforeinput: '_element__on_beforeInput',
            blur: '_element__on_blur',
            contextmenu: '_element__on_contextMenu',
            dragend: '_element__on_dragEnd',
            dragstart: '_element__on_dragStart',
            drop: '_element__on_drop',
            focus: '_elemeent__on_focus',
            keydown: '_element__on_keyDown',
            pointerdown: '_element__on_pointerDown',
            touchstart: '_element__on_touchStart',
        },
    };


    __element = null;

    _dragTarget = null;
    _history = [];
    _history_index = -1;


    get _element() {
        return this.__element;
    }
    set _element(element) {
        if (this._element) {
            this.constructor.eventListeners__remove(this._element, this._eventListeners.element);
        }

        this.__element = element;
        this.constructor.eventListeners__add(this._element, this._eventListeners.element);
    }

    get _focused() {
        return this._attributes._focused;
    }
    set _focused(focused) {
        this._attribute__set('_focused', focused);
    }


    get disabled() {
        return this._attributes.disabled;
    }
    set disabled(disabled) {
        this._attribute__set('disabled', disabled);
        this._element.disabled = this.disabled;
    }

    get dragAndDrop() {
        return this._attributes.dragAndDrop;
    }
    set dragAndDrop(dragAndDrop) {
        this._attribute__set('dragAndDrop', dragAndDrop);
    }

    get placeholder() {
        return this._attributes.placeholder;
    }
    set placeholder(placeholder) {
        this._attribute__set('placeholder', placeholder);
        this._element.placeholder = this.placeholder;
    }


    _element__on_beforeInput(event) {
        if (!event.inputType.startsWith('history')) return;

        event.preventDefault();
    }

    _element__on_blur() {
        this._focused = false;
    }

    _element__on_dragEnd() {
        this._dragTarget = null;
    }

    _element__on_dragStart(event) {
        if (!this.dragAndDrop) {
            event.preventDefault();

            return;
        }

        this._dragTarget = event.target;
        event.stopPropagation();
    }

    _element__on_drop(event) {
        if (event.target != this._dragTarget) return;

        event.preventDefault();
    }

    _elemeent__on_focus() {
        this._focused = true;
    }

    _element__on_keyDown(event) {
        if (!event.ctrlKey) return;

        if (event.code == 'KeyY') {
            this.redo();
        }
        else if (event.code == 'KeyZ') {
            this.undo();
        }
    }

    _element__on_pointerDown(event) {
        if (this.dragAndDrop && !event.ctrlKey) return;

        this._element.setSelectionRange(0, 0);
    }

    // _element__set(element) {
    //     if (this._element) {
    //         this.constructor.eventListeners__apply(this._element, this._eventListeners.element, false);
    //     }

    //     this._element = element;
    //     this.constructor.eventListeners__apply(this._element, this._eventListeners.element);
    // }

    _init() {
        this.props__sync('disabled', 'placeholder');
    }

    _element__on_contextMenu(event) {
        event.preventDefault();
    }

    _element__on_touchStart(event) {
        event.stopPropagation();
    }


    blur() {
        this._element.blur();
    }

    focus() {
        this._element.focus();
    }

    redo() {

    }

    undo() {

    }
}
