// 07.07.2024


import {Component} from '../Component/Component.js';

import {Http} from '../../../Js/Http/Http.js';


export class Svg extends Component {
    static _css_url = true;
    static _doms_cache = {};
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        url: '',
    };


    static {
        this.init();
    }


    _defined = null;
    _url_hash = '';
    _url_main = '';


    get url() {
        return this._attributes.url;
    }
    set url(url) {
        let url_matches = url?.match(/([^#]+)(#[^#]+)?/);

        if (!url_matches) return;

        this._url_hash = url_matches[2] || '';
        this._url_main = url_matches[1];
        url = this._url_main + this._url_hash;
        this._attribute__set('url', url);

        this._dom__define();
    }

    async _dom__create() {
        let html = await Http.fetch_text(this._url_main);

        return this.constructor.dom__create(html);
    }

    async _dom__define() {
        let dom_promise = this.constructor._doms_cache[this._url_main];

        if (!dom_promise) {
            dom_promise = this._dom__create();
            this.constructor._doms_cache[this._url_main] = dom_promise;
        }

        this._defined = dom_promise;
        this._shadow.textContent = '';
        let dom = await dom_promise;

        if (!dom) return;

        if (this._url_hash) {
            dom = dom.querySelector(this._url_hash);
        }

        if (!dom) return;

        dom = dom.cloneNode(true);
        this._shadow.append(dom);
    }

    _init() {
        this.props__sync('url');
    }
}
