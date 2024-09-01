import {Components} from '../../../Global/Frontend/Frontend.js';

import {Replacement} from '../../Units/Units.js';

import {ButtonBack} from '../ButtonBack/ButtonBack.js';
import {RestClient} from '../../../Global/Js/Js.js';
import {Units} from '../../../Global/Frontend/Frontend.js';

export class Settings extends Components.Component {
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        language: 'ru',
        newsletter: false,
    };

    static _elements = {
        root: '',
        setting_language_list: '',
        switch: '',
    };

    static _eventListeners_elements = {
        setting_language_list: {
            change: '_setting_language_list__on_pointerDown',
        },
        switch : {
            toggle: '_switch__on_toggle',
        },
    };


    static {
        this.init();
    }


    _translator = new Replacement();
    _rest = new RestClient(new URL('./Packages/Backend/Manager/Manager', location));


    get language() {
        return this._attributes.language;
    }
    set language(language) {
        this._attribute__set('language', language);
        this._translator.replace_object = language;
        this._translator.replace(this._elements.root);
    }

    get newsletter() {
        return this._attributes.newsletter;
    }
    set newsletter(newsletter) {
        this._attribute__set('newsletter', newsletter);
        this._elements.switch.on = newsletter;
    }


    _init() {
        this.props__sync('language');
    }

    _setting_language_list__on_pointerDown(event) {
        this.event__dispatch('language__toggle', {language: event.target.value});
    }

    _switch__on_toggle() {
        this._rest.call('newsletter_set', Units.Telegram.user?.id, this._elements.switch.on)
    }
}
