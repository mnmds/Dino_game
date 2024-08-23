import {Components} from '../../../Global/Frontend/Frontend.js';
import {ShopButton} from '../ShopButton/ShopButton.js';


export class Subscribe extends Components.Component {
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,
        task: '',
        image: '',
        value: 0,
        status: 'sale',
        link: '',
    };

    static _elements = {
        task: '',
        image: '',
        reward: '',
    };

    static _eventListeners = {};


    static {
        this.init();
    }

    get task() {
        return this._attributes.task;
    }
    set task(task) {
        this._attribute__set('task', task);
        this._elements.task.textContent = task;
    }

    get image() {
        return this._attributes.image;
    }
    set image(image) {
        this._attribute__set('image', image);
        this._elements.image.src = `./Packages/Frontend/Components/Subscribe/${image}.png`;
    }

    get value() {
        return this._attributes.value;
    }
    set value(value) {
        this._attribute__set('value', value);
        this._elements.reward.statuses_values.sale.text = value;
        this._elements.reward.status_value__refresh();
    }

    get status() {
        return this._attributes.status;
    }
    set status(status) {
        this._attribute__set('status', status);
        this._elements.reward.status = status;
    }


    _init() {

    }
}
