// 07.07.2024


import {Component} from '../Component/Component.js';

import {ExternalPromise} from '../../../Js/ExternalPromise/ExternalPromise.js';


export class Svg extends Component {
    static _css_url = true;
    static _html_url = true;
    static _resources_rootElements = {};
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        url: '',
    };

    static _elements = {
        resource: '',
        root: '',
    };

    static _eventListeners_elements = {
        resource: {
            load: '_resource__on_load',
        },
    };


    static {
        this.init();
    }


    _url_hash = '';
    _url_main = '';


    get url() {
        return this._attributes.url;
    }
    set url(url) {
        let url_matches = url?.match(/([^#]+)(#.+)?/);

        if (!url_matches) return;

        this._url_hash = url_matches[2] || '';
        this._url_main = url_matches[1];
        // this._elements.resource.data = this._url_main;
        // this._url_main = this._elements.resource.data;
        url = this._url_main + this._url_hash;
        this._attribute__set('url', url);

        this._load();
    }


    _init() {
        this._elements.resource.remove();
        this.props__sync('url');
    }

    async _load() {
        let rootElements = this.constructor._resources_rootElements;

        if (!rootElements[this._url_main]) {
            rootElements[this._url_main] = new ExternalPromise();
            this._elements.resource.data = this._url_main;
            this._elements.root.append(this._elements.resource);
        }

        let element = (await rootElements[this._url_main]).cloneNode(true);
        this._elements.resource.data = '';
        this._elements.root.textContent = '';

        if (this._url_hash) {
            element = element.querySelector(this._url_hash);
        }

        if (!element) return;

        this._elements.root.append(element);
    }

    _resource__on_load() {
        this.constructor._resources_rootElements[this._url_main].fulfill(this._elements.resource.contentDocument.rootElement);
    }
}
