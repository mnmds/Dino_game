import {Components} from '../../../Global/Frontend/Frontend.js';

import {Replacement} from '../../Units/Units.js';

import {ButtonBack} from '../ButtonBack/ButtonBack.js';

export class Settings extends Components.Component {
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        language: 'ru',
    };

    static _elements = {
        root: '',
        setting_language_list: '',
    };

    static _eventListeners_elements = {
        setting_language_list: {
            change: '_setting_language_list__on_pointerDown'
        }
    };


    static {
        this.init();
    }


    _translator = new Replacement();


    get language() {
        return this._attributes.language;
    }
    set language(language) {
        this._attribute__set('language', language);
        this._translator.replace_object = language;
        this._translator.replace(this._elements.root);
    }


    _init() {
        this.props__sync('language');
    }

    _setting_language_list__on_pointerDown(event) {
        this.event__dispatch('language__toggle', {language: event.target.value});
    }
}
