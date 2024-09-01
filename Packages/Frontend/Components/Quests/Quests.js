import {Components} from '../../../Global/Frontend/Frontend.js';
import {Subscribe} from '../Subscribe/Subscribe.js';
import {ButtonBack} from '../ButtonBack/ButtonBack.js';
import {Timer} from '../Timer/Timer.js';
import {RestClient} from '../../../Global/Js/Js.js';
import {Units} from '../../../Global/Frontend/Frontend.js';


export class Quests extends Components.Component {
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _components = [
        ButtonBack,
        Components.Repeater,
        Subscribe,
        Timer,
    ];

    static _attributes = {
        ...super._attributes,
    };

    static _elements = {
        repeater: '',
        timer: '',
        timer_button: '',
        present: '',
    };

    static _eventListeners = {};

    static Repeater_manager = class extends Components.Repeater.Manager {
        data__apply() {
            this._item.task = this._model_item.name;
            // this._item.image = this._model_item.image;
            this._item.value = this._model_item.description;
            this._item.status = 'sale';
            this._item.link = this._model_item.url;
        }

        init() {
            this.data__apply();
        }
    };

    static _eventListeners_elements = {
        timer_button: {
            pointerdown: '_reward__on_pointerDown',
        }
    };


    static {
        this.init();
    }

    _rest = new RestClient(new URL('./Packages/Backend/Manager/Manager', location));

    async _reward__on_pointerDown() {
        let current_time = new Date();

        if (current_time.getHours() == 17) {
            await this._rest.call('time_quest', Units.Telegram.user.id);
        }
    }

    _init() {
        this._elements.repeater.Manager = this.constructor.Repeater_manager;
        this.data_insert();
        this.refresh();
    }

    data_insert(data) {
        this._elements.repeater.model.clear();
        this._elements.repeater.model.add(data);
    }

    millisSinceStartOfDay() {
      let now = new Date();
      let startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return now.getTime() - startOfDay.getTime();
    }

    async refresh() {
        let time = this.millisSinceStartOfDay();
        let current_time = new Date();

        if (current_time.getHours() == 17) {
            this._elements.timer.style.display = 'none';
            this._elements.timer_button.style.background = 'var(--Theme__block__background_accent)';
            this._elements.present.style.display = 'block';
        }
        else if (current_time.getHours() < 17) {
            this._elements.present.style.display = 'none';
            this._elements.timer.duration = 14 * 60 * 60 * 1000 - time;
            this._elements.timer.start();
        }
        else if (current_time.getHours() > 17) {
            this._elements.present.style.display = 'none';
            this._elements.timer.duration = 38 * 60 * 60 * 1000 - time;
            this._elements.timer.start();
        }
    }
}
