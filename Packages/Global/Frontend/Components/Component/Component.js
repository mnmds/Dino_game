// 25.12.2020; 06.05.2024; 04.08.2024


import {EventManager} from '../../Units/EventManager/EventManager.js';

import {Class} from '../../../Js/Class/Class.js';
import {Common} from '../../../Js/Common/Common.js';
import {ExternalPromise} from '../../../Js/ExternalPromise/ExternalPromise.js';
import {Http} from '../../../Js/Http/Http.js';


export class Component extends Class.mix(HTMLElement, EventManager) {
    static _components = [];
    static _css = '';
    static _css_url = '';
    static _defined = null;
    static _dom = null;
    static _dom_slot = false;
    static _elements = {};
    static _elements_classes = {};
    static _eventListeners = {};
    static _eventListeners_elements = {};
    static _eventListeners_shadow = {};
    static _eventListeners_slots = {};
    static _eventListeners_target = {};
    static _html = '';
    static _html_url = '';
    static _http = null;
    static _interpolation_regExp = /{{\s*(?<key>.*?)\s*:\s*(?<value>.*?)\s*}}/g;
    static _interpolations = {};
    static _interpolations_key = '';
    static _shadow_opts = {mode: 'closed'};
    static _slots = [];
    static _styleSheet = null;
    static _styleSheets = {};
    static _styleSheets_descriptors = {};
    static _tag = '';
    static _tag_prefix = 'x';
    static _url = import.meta.url;

    static _attributes = {
        _building: false,


        autoRefresh: false,
        inert: false,
    };


    static observedAttributes = [];


    static async _components__await() {
        let promises = this._components.map((item) => item._defined);
        promises.push(Object.getPrototypeOf(this)._defined);

        await Promise.all(promises);
    }

    static async _dom__define() {
        let css = '';
        let html = '';

        if (this._css) {
            css = this._css;
        }
        else if (this._css_url) {
            let css_url = this._css_url === true ? `${this.name}.css` : this._css_url;
            css = this._http.fetch_text(css_url);
        }

        if (this._html) {
            html = this._html;
        }
        else if (this._html_url) {
            let html_url = this._html_url === true ? `${this.name}.html` : this._html_url;
            html = this._http.fetch_text(html_url);
        }

        [css, html] = await Promise.all([css, html]);

        if (css) {
            this._styleSheet = new CSSStyleSheet({baseURL: this._url});
            css = this.interpolate(css, this._interpolations_key, this._interpolations);
            await this._styleSheet.replace(css);
        }

        if (html) {
            html = this.interpolate(html, this._interpolations_key, this._interpolations);
            this._dom = this.dom__create(html);
        }
        else if (css) {
            this._dom = new DocumentFragment();

            if (this._dom_slot) {
                let slot = document.createElement('slot');
                slot.className = 'root';
                this._dom.append(slot);
            }
        }
        else return;

        this._elements_classes__define();
    }

    static _elements_classes__define() {
        let elements = this.elements__get(this._dom, this._elements);

        for (let [key, value] of Object.entries(this._elements_classes)) {
            let element = elements[key];
            let cssClasses = value.split?.(/\s+/) || value;

            for (let cssClass of cssClasses) {
                element.classList.add(cssClass);
            }
        }
    }

    static _observedAttributes__define() {
        if (!Object.hasOwn(this, '_attributes')) return;

        this.observedAttributes = [];

        for (let attribute_name of Object.keys(this._attributes)) {
            if (attribute_name.startsWith('_')) continue;

            let attribute_name_lowerCase = attribute_name.toLowerCase();
            this.observedAttributes[attribute_name_lowerCase] = attribute_name;
            this.observedAttributes.push(attribute_name_lowerCase);
        }
    }

    static async _styleSheets_descriptors__proc() {
        if (!Object.hasOwn(this, '_styleSheets_descriptors')) return;

        let styleSheets_descriptors_keys = [...Object.keys(this._styleSheets_descriptors)];
        let styleSheets_descriptors_processed = {};

        for (let styleSheet_key of styleSheets_descriptors_keys) {
            let styleSheet_descriptor = this._styleSheets_descriptors[styleSheet_key];

            if (!(styleSheet_descriptor instanceof Array)) {
                styleSheet_descriptor = [styleSheet_descriptor, true];
            }

            styleSheets_descriptors_processed[styleSheet_key] = {
                enabled: styleSheet_descriptor[1],
                text: styleSheet_descriptor[0] ? this._http.fetch_text(styleSheet_descriptor[0]) : '',
            };
        }

        let styleSheets_texts_promises = [];

        if (styleSheets_descriptors_keys.length && !Object.hasOwn(this, '_styleSheets')) {
            this._styleSheets = {};
        }

        for (let styleSheet_key of styleSheets_descriptors_keys) {
            if (this._styleSheets[styleSheet_key]) continue;

            let styleSheet_descriptor = styleSheets_descriptors_processed[styleSheet_key];
            let styleSheet = new CSSStyleSheet({disabled: !styleSheet_descriptor.enabled});
            let styleSheet_text_promise = styleSheet.replace(await styleSheet_descriptor.text);
            styleSheets_texts_promises.push(styleSheet_text_promise);

            this._styleSheets[styleSheet_key] = styleSheet;
        }

        await Promise.all(styleSheets_texts_promises);
    }


    static attribute__get(element, attribute_name, attribute_constructor = null) {
        let attribute_value = element.getAttribute(attribute_name);

        if (attribute_value == null) return null;

        if (attribute_constructor == Boolean) {
            attribute_value = attribute_value != null;
        }
        else if (attribute_constructor == Number) {
            attribute_value = +attribute_value;
        }

        return attribute_value;
    }

    static attribute__set(element, attribute_name, attribute_value = null) {
        if (attribute_value === false || attribute_value == null) {
            element.removeAttribute(attribute_name);

            return;
        }

        if (attribute_value === true) {
            attribute_value = '';
        }

        element.setAttribute(attribute_name, attribute_value);
    }

    static coords__get(element, margins = false) {
        let domRect = element.getBoundingClientRect();
        let coords = {
            bottom: domRect.bottom + window.scrollY,
            height: domRect.height,
            left: domRect.left + window.scrollX,
            right: domRect.right + window.scrollX,
            top: domRect.top + window.scrollY,
            width: domRect.width,
        };

        if (margins) {
            let margin_left = this.css_numeric__get(element, 'marginLeft');
            let margin_top = this.css_numeric__get(element, 'marginTop');
            coords.bottom += margin_top;
            coords.left += margin_left;
            coords.right += margin_left;
            coords.top += margin_top;
        }

        return coords;
    }

    static css__get(element, prop_name) {
        return getComputedStyle(element)[prop_name];
    }

    static css__set(element, prop_name, prop_value = '') {
        element.style.setProperty(prop_name, prop_value);
    }

    static css_numeric__get(element, prop_name) {
        let prop_value = this.css__get(element, prop_name);

        return parseFloat(prop_value);
    }

    static dom__create(html) {
        if (!html) return null;

        let template = document.createElement('template');
        template.innerHTML = html;
        let dom = template.content;

        return dom;
    }

    static elements__get(dom, elements_descriptors) {
        let elements = {};

        for (let [key, value] of Object.entries(elements_descriptors)) {
            if (value instanceof Array) {
                let elements_sub = [];
                let selectors = value;

                for (let selector of selectors) {
                    elements_sub.push(...dom.querySelectorAll(selector));
                }

                elements[key] = elements_sub;
            }
            else {
                let selector = value;

                if (!selector) {
                    selector = `.${key}`;
                }
                else if (selector.length == 1) {
                    selector = `${selector}${key}`;
                }

                elements[key] = dom.querySelector(selector);
            }
        }

        return elements;
    }

    static height_inner__get(element) {
        return element.clientHeight - this.css_numeric__get(element, 'paddingTop') - this.css_numeric__get(element, 'paddingBottom');
    }

    static height_inner__set(element, height = null) {
        if (!height && height !== 0) {
            element.style.height = '';

            return;
        }

        let css_height = height;

        if (this.css__get(element, 'boxSizing') == 'border-box') {
            css_height += this.css_numeric__get(element, 'borderTopWidth') + this.css_numeric__get(element, 'borderBottomWidth') + this.css_numeric__get(element, 'paddingTop') + this.css_numeric__get(element, 'paddingBottom');
        }

        element.style.height = `${css_height}px`;
    }

    static height_outer__get(element) {
        if (!this.visible__get(element)) return 0;

        return element.offsetHeight + this.css_numeric__get(element, 'marginTop') + this.css_numeric__get(element, 'marginBottom');
    }

    static height_outer__set(element, height = null) {
        if (!height && height !== 0) {
            element.style.height = '';

            return;
        }

        let css_height = height - this.css_numeric__get(element, 'marginTop') - this.css_numeric__get(element, 'marginBottom');

        if (this.css__get(element, 'boxSizing') != 'border-box') {
            css_height -= this.css_numeric__get(element, 'borderTopWidth') + this.css_numeric__get(element, 'borderBottomWidth') + this.css_numeric__get(element, 'paddingTop') + this.css_numeric__get(element, 'paddingBottom');
        }

        css_height = Math.max(css_height, 0);
        element.style.height = `${css_height}px`;
    }

    static async init({
        css,
        css_url,
        dom_slot,
        elements_classes,
        html,
        html_url,
        interpolations,
        interpolations_key,
        styleSheets,
        styleSheets_descriptors,
        tag_prefix,
        url,
    } = {}) {
        if (customElements.getName(this)) return;

        Class.props__create(
            this,
            {
                _css: css,
                _css_url: css_url,
                _dom_slot: dom_slot,
                _elements_classes: elements_classes,
                _html: html,
                _html_url: html_url,
                _interpolations: interpolations,
                _interpolations_key: interpolations_key,
                _styleSheets: styleSheets,
                _styleSheets_descriptors: styleSheets_descriptors,
                _tag_prefix: tag_prefix,
                _url: url,
            }
        );

        if (this._defined && Object.hasOwn(this, '_defined')) return;

        this._defined = new ExternalPromise();

        await new Promise(setTimeout);

        this._http = new Http({
            cache: true,
            url_base: this._url,
        });
        this._tag = `${this._tag_prefix}-${this.name}`.toLowerCase();
        this._observedAttributes__define();
        await Promise.all([
            this._components__await(),
            this._dom__define(),
            this._styleSheets_descriptors__proc(),
        ]);

        customElements.define(this._tag, this);
        this._defined.fulfill();
    }

    static interpolate(string, interpolation_key, interpolations) {
        let f = (match, key, value) => {
            if (key != interpolation_key) return match;

            return Class.extract(interpolations, value) ?? '';
        };

        return string.replace(this._interpolation_regExp, f);
    }

    static left__get(element) {
        if (!element.offsetParent) return 0;

        return element.offsetLeft - this.css_numeric__get(element, 'marginLeft') - this.css_numeric__get(element.offsetParent, 'paddingLeft');
    }

    static left__set(element, left = null) {
        if (!left && left !== 0) {
            element.style.left = '';

            return;
        }

        let css_left_prev = this.css_numeric__get(element, 'left');
        let left_prev = this.left__get(element);

        if (css_left_prev == 'auto') {
            css_left_prev = this.css__get(element, 'position') == 'relative' ? 0 : left_prev;
        }

        let css_left = css_left_prev + left - left_prev;
        element.style.left = `${css_left}px`;
    }

    static path__get(element, root = null) {
        let path = [];
        let aim = element;

        while (aim && aim != root) {
            path.push(aim);
            aim = aim.parentElement;
        }

        path.reverse();

        return path;
    }

    static async resources__await(elements, url_prop_name = '') {
        let location_url = location.href.replace(/#.*$/, '');
        let promises = [];

        for (let element of elements) {
            let resource_url = element[url_prop_name];

            if (resource_url == location_url || url_prop_name && !resource_url) continue;

            let promise = new ExternalPromise();
            promises.push(promise);

            let resource__on_error = () => promise.reject();
            let resource__on_load = () => {
                element.removeEventListener('error', resource__on_error);
                promise.fulfill();
            };
            element.addEventListener('error', resource__on_error, {once: true});
            element.addEventListener('load', resource__on_load, {once: true});
        }

        await Promise.allSettled(promises);
    }

    static styleSheets__enable(...styleSheets_keys) {
        if (!Object.hasOwn(this, '_styleSheets')) return;

        for (let styleSheet of Object.values(this._styleSheets)) {
            styleSheet.disabled = true;
        }

        for (let styleSheet_key of styleSheets_keys) {
            if (!this._styleSheets[styleSheet_key]) continue;

            this._styleSheets[styleSheet_key].disabled = false;
        }
    }

    static top__get(element) {
        if (!element.offsetParent) return 0;

        return element.offsetTop - this.css_numeric__get(element, 'marginTop') - this.css_numeric__get(element.offsetParent, 'paddingTop');
    }

    static top__set(element, top = null) {
        if (!top && top !== 0) {
            element.style.top = '';

            return;
        }

        let css_top_prev = this.css_numeric__get(element, 'top');
        let top_prev = this.top__get(element);

        if (css_top_prev == 'auto') {
            css_top_prev = this.css__get(element, 'position') == 'relative' ? 0 : top_prev;
        }

        let css_top = css_top_prev + top - top_prev;
        element.style.top = `${css_top}px`;
    }

    static visible__get(element) {
        return !!(element.offsetHeight && element.offsetWidth);
    }

    static width_inner__get(element) {
        return element.clientWidth - this.css_numeric__get(element, 'paddingLeft') - this.css_numeric__get(element, 'paddingRight');
    }

    static width_inner__set(element, width = null) {
        if (!width && width !== 0) {
            element.style.width = '';

            return;
        }

        let css_width = width;

        if (this.css__get(element, 'boxSizing') == 'border-box') {
            css_width += this.css_numeric__get(element, 'borderLeftWidth') + this.css_numeric__get(element, 'borderRightWidth') + this.css_numeric__get(element, 'paddingLeft') + this.css_numeric__get(element, 'paddingRight');
        }

        element.style.width = `${css_width}px`;
    }

    static width_outer__get(element) {
        if (!this.visible__get(element)) return 0;

        return element.offsetWidth + this.css_numeric__get(element, 'marginLeft') + this.css_numeric__get(element, 'marginRight');
    }

    static width_outer__set(element, width = null) {
        if (!width && width !== 0) {
            element.style.width = '';

            return;
        }

        let css_width = width - this.css_numeric__get(element, 'marginLeft') - this.css_numeric__get(element, 'marginRight');

        if (this.css__get(element, 'boxSizing') != 'border-box') {
            css_width -= this.css_numeric__get(element, 'borderLeftWidth') + this.css_numeric__get(element, 'borderRightWidth') + this.css_numeric__get(element, 'paddingLeft') + this.css_numeric__get(element, 'paddingRight');
        }

        css_width = Math.max(css_width, 0);
        element.style.width = `${css_width}px`;
    }

    static wrap(nodes, wrapper_tag = 'div') {
        if (!nodes[Symbol.iterator]) {
            nodes = [nodes];
        }

        let node_prev = nodes[0].previousSibling;
        let nodes_parent = nodes[0].parentNode;

        let wrapper = document.createElement(wrapper_tag);
        wrapper.append(...nodes);

        node_prev ? node_prev.after(wrapper) : nodes_parent.append(wrapper);

        return wrapper;
    }


    static {
        this.init();
    }


    _attributes = {};
    _attributes_observing = false;
    _built = new ExternalPromise();
    _elements = {};
    _eventListeners = {};
    _eventListeners_elements = {};
    _eventListeners_shadow = {};
    _eventListeners_slots = {};
    _eventListeners_target = {};
    _internals = this.attachInternals();
    _shadow = null;
    _slots = {};
    _target = this;


    get _building() {
        return this._attributes._building;
    }
    set _building(building) {
        this._attribute__set('_building', building);
    }


    get autoRefresh() {
        return this._attributes.autoRefresh;
    }
    set autoRefresh(autoRefresh) {
        this._attribute__set('autoRefresh', autoRefresh);
    }

    get inert() {
        return this._attributes.inert;
    }
    set inert(inert) {
        this._attribute__set('inert', inert);
    }


    _attribute__get(attribute_name) {
        let attribute_descriptor = this.constructor._attributes[attribute_name];
        let attribute_value_default = attribute_descriptor instanceof Object ? attribute_descriptor.default : attribute_descriptor;

        return this.attribute__get(attribute_name, attribute_value_default?.constructor);
    }

    _attribute__set(attribute_name, attribute_value = null) {
        let attribute_descriptor = this.constructor._attributes[attribute_name];
        let attribute_value_default = attribute_descriptor instanceof Object ? attribute_descriptor.default : attribute_descriptor;

        if (attribute_value == null || attribute_value instanceof Object) {
            attribute_value = attribute_value_default;
        }
        else {
            let attribute_constructor = attribute_value_default?.constructor;

            if (attribute_constructor == Boolean) {
                attribute_value = !!attribute_value;
                attribute_value ? this._internals.states.add(attribute_name) : this._internals.states.delete(attribute_name);
            }
            else if (attribute_constructor == Number) {
                attribute_value = +attribute_value;
            }
            else {
                attribute_value += '';
            }

            if (
                attribute_descriptor?.enum && !attribute_descriptor.enum.includes(attribute_value)
                || attribute_descriptor?.range && !Common.in_range(attribute_value, ...attribute_descriptor.range)
            ) {
                attribute_value = attribute_value_default;
            }
        }

        this._attributes[attribute_name] = attribute_value;

        if (!attribute_descriptor?.persistent && attribute_value == attribute_value_default && attribute_value !== true) {
            attribute_value = null;
        }

        let attributes_observing = this._attributes_observing;
        this._attributes_observing = false;
        this.attribute__set(attribute_name, attribute_value);
        this._attributes_observing = attributes_observing;
    }

    _attributes__init() {
        this._attributes = {};

        for (let attribute_name of Object.keys(this.constructor._attributes)) {
            this._attribute__set(attribute_name, this._attribute__get(attribute_name));
        }
    }

    async _build() {
        if (this._attributes_observing) return;

        this._attributes_observing = true;
        this._building = true;

        if (this.constructor._dom) {
            this._shadow = this.attachShadow(this.constructor._shadow_opts);
            this._shadow.append(this.constructor._dom.cloneNode(true));

            this._elements = this.constructor.elements__get(this._shadow, this.constructor._elements);
            this._target = this._shadow.querySelector('[Component__target]') || this;
            this._slots__define();
            this._styleSheets__apply();

            await this._components__await();
        }

        this._building = false;
        this._attributes__init();
        this._eventListeners__define();
        this._eventListeners__apply();
        await this._init();
        this._built.fulfill(true);
    }

    async _components__await() {
        let components = [];

        for (let Component of this.constructor._components) {
            let components_sub = this._shadow.querySelectorAll(Component._tag);
            components.push(...components_sub);
        }

        let promises = components.map((item) => item._built);
        await Promise.all(promises);
    }

    _eventListeners__apply(add = true) {
        this.constructor.eventListeners__apply(this._shadow || this, this._eventListeners_shadow, add);
        this.constructor.eventListeners__apply(this._target, this._eventListeners_target, add);
        this.constructor.eventListeners_groups__apply(this._elements, this._eventListeners_elements, add);
        this.constructor.eventListeners_groups__apply(this._slots, this._eventListeners_slots, add);
    }

    _eventListeners__define() {
        this._eventListeners = this._eventListeners__proc(this.constructor._eventListeners, true);
        this._eventListeners_elements = this._eventListeners__proc(this.constructor._eventListeners_elements, true);
        this._eventListeners_shadow = this._eventListeners__proc(this.constructor._eventListeners_shadow, !!this._shadow);
        this._eventListeners_slots = this._eventListeners__proc(this.constructor._eventListeners_slots, true);
        this._eventListeners_target = this._eventListeners__proc(this.constructor._eventListeners_target, this._target != this);
    }

    _init() {}

    _refresh() {}

    _slots__define() {
        this._slots = {};

        for (let slot_name of this.constructor._slots) {
            let slot = this._shadow.querySelector(`slot[name="${slot_name}"]`);
            let elements = slot.assignedElements();
            elements = elements.length ? elements : slot.children;
            this._slots[slot_name] = elements.length > 1 ? elements : elements[0];
        }
    }

    _styleSheets__apply() {
        if (this.constructor._styleSheet) {
            this._shadow.adoptedStyleSheets.push(this.constructor._styleSheet);
        }

        for (let styleSheet of Object.values(this.constructor._styleSheets)) {
            this._shadow.adoptedStyleSheets.push(styleSheet);
        }
    }


    attributeChangedCallback(attribute_name, attribute_value_prev, attribute_value) {
        if (!this._attributes_observing || attribute_value == attribute_value_prev) return;

        attribute_name = this.constructor.observedAttributes[attribute_name];
        this[attribute_name] = this._attribute__get(attribute_name);
    }

    attribute__get(attribute_name, attribute_constructor = null) {
        return this.constructor.attribute__get(this, attribute_name, attribute_constructor);
    }

    attribute__set(attribute_name, attribute_value = null) {
        return this.constructor.attribute__set(this, attribute_name, attribute_value);
    }

    // constructor() {
    //     super();

    //     this._build();
    // }

    connectedCallback() {
        this._build();
    }

    coords__get() {
        return this.constructor.coords__get(this._target);
    }

    css__get(prop_name) {
        return this.constructor.css__get(this._target, prop_name);
    }

    css__set(prop_name, prop_value) {
        return this.constructor.css__set(this._target, prop_name, prop_value);
    }

    css_numeric__get(prop_name) {
        return this.constructor.css_numeric__get(this._target, prop_name);
    }

    height_inner__get() {
        return this.constructor.height_inner__get(this._target);
    }

    height_inner__set(height = null) {
        return this.constructor.height_inner__set(this._target, height);
    }

    height_outer__get() {
        return this.constructor.height_outer__get(this._target);
    }

    height_outer__set(height = null) {
        return this.constructor.height_outer__set(this._target, height);
    }

    left__get() {
        return this.constructor.left__get(this._target);
    }

    left__set(left = null) {
        return this.constructor.left__set(this._target, left);
    }

    path__get(root = null) {
        return this.constructor.path__get(this, root);
    }

    props__sync(...props_names) {
        props_names = props_names.length ? props_names : Object.keys(this.constructor._attributes);

        for (let prop_name of props_names) {
            this[prop_name] = this._attributes[prop_name];
        }
    }

    refresh(force = true) {
        if (!force && !this.autoRefresh) return;

        this._refresh();
    }

    top__get() {
        return this.constructor.top__get(this._target);
    }

    top__set(top = null) {
        return this.constructor.top__set(this._target, top);
    }

    visible__get() {
        return this.constructor.visible__get(this._target);
    }

    width_inner__get() {
        return this.constructor.width_inner__get(this._target);
    }

    width_inner__set(width = null) {
        return this.constructor.width_inner__set(this._target, width);
    }

    width_outer__get() {
        return this.constructor.width_outer__get(this._target);
    }

    width_outer__set(width = null) {
        return this.constructor.width_outer__set(this._target, width);
    }
}
