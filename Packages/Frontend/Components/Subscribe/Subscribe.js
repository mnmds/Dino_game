import {Components} from '../../../Global/Frontend/Frontend.js';
import {Units} from '../../../Global/Frontend/Frontend.js';
import {ShopButton} from '../ShopButton/ShopButton.js';
import {RestClient} from '../../../Global/Js/Js.js';


export class Subscribe extends Components.Component {
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _components = [
        ShopButton,
    ];

    static _attributes = {
        ...super._attributes,

        link: '',
        status: 'sale',
        task: '',
        value: '',
    };

    static _elements = {
        task: '',
        reward: '',
    };

    _rest = new RestClient(new URL('./Packages/Backend/Manager/Manager', location));

    static _eventListeners_elements = {
        reward: {
            pointerdown: '_reward__on_pointerDown',
        }
    };


    static {
        this.init();
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

    get value() {
        return this._attributes.value;
    }
    set value(value) {
        this._attribute__set('value', value);
        this._elements.reward.statuses_values.sale.text = value;
    }


    async _reward__on_pointerDown() {
        if (this.link.substr(12, 20) == 'telegram') {
            Units.Telegram.link_telegram__open(this.link);
            await this._rest.call('tg_subscribe__check', this.link, Units.Telegram.user.id);
        }
        else {
            // console.log(this.link);
            Units.Telegram.link_outside__open(this.link);
            await this._rest.call('bonus_check', this.link, Units.Telegram.user.id);
        }
    }

    _init() {
        this._elements.reward.statuses_values.selected.icon_svg = './Storage/Images/Main.svg#present';
        this._elements.reward.statuses_values.selected.text = '';
    }
}
