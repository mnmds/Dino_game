import {Components} from '../../../Global/Frontend/Frontend.js';

import {ShopButton} from '../ShopButton/ShopButton.js';


export class Subscribe extends Components.Component {
    static _components = [ShopButton];
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        link: '',
        price: 0,
        status: 'sale',
        task: '',
        type: '',
    };

    static _elements = {
        image: '',
        reward: '',
        task: '',
    };

    static _eventListeners = {};


    static {
        this.init();
    }

    get price() {
        return this._attributes.price;
    }
    set price(price) {
        this._attribute__set('price', price);
        this._elements.reward.statuses_values.sale.text = price;
        this._elements.reward.status_value__refresh();
    }

    get status() {
        return this._attributes.status;
    }
    set status(status) {
        this._attribute__set('status', status);
        this._elements.reward.status = status;
    }

    get task() {
        return this._attributes.task;
    }
    set task(task) {
        this._attribute__set('task', task);
        this._elements.task.textContent = task;
    }

    get type() {
        return this._attributes.type;
    }
    set type(type) {
        this._attribute__set('type', type);
        this._elements.image.src = `./Storage/Images/Subscribe_${type}.png`;
    }


    _init() {

    }
}
