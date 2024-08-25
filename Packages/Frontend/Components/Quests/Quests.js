import {Components} from '../../../Global/Frontend/Frontend.js';
import {Subscribe} from '../Subscribe/Subscribe.js';
import {ButtonBack} from '../ButtonBack/ButtonBack.js';


export class Quests extends Components.Component {
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _components = [
        ButtonBack,
        Components.Repeater,
        Subscribe,
    ];

    static _attributes = {
        ...super._attributes,
    };

    static _elements = {
        repeater: '',
    };

    static _eventListeners = {};

    static Repeater_manager = class extends Components.Repeater.Manager {
        data__apply() {
            this._item.task = this._model_item.name;
            // this._item.image = this._model_item.image;
            this._item.value = this._model_item.description;
            this._item.status = this._model_item.status;
            this._item.link = this._model_item.url;
        }

        init() {
            this.data__apply();
        }
    };


    static {
        this.init();
    }


    _init() {
        this._elements.repeater.Manager = this.constructor.Repeater_manager;
        this.data_insert();
    }

    data_insert() {
        this._elements.repeater.model.clear();
        this._elements.repeater.model.add([
            {
                name: 'Подписка на Геншиндроп',
                description: '50000',
                status: 'sale',
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            },
            {
                name: 'Перейти к отметкам на сайте',
                description: '',
                status: 'selected',
                url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            },
        ]);
    }
}
