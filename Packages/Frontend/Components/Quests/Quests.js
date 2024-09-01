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

    getTimeToNextSeventeenInMilliseconds() {
      // Устанавливаем часовой пояс Москвы
      const moscowTime = new Date().toLocaleString("en-US", { timeZone: "Europe/Moscow" });

      // Получаем текущее время в московском часовом поясе
      const now = new Date(moscowTime);

      // Получаем часы и минуты текущего времени
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // Проверяем, находимся ли мы между 17:00 и 18:00
      if (hours === 17 && minutes >= 0 && minutes < 60) {
        console.log("Сейчас между 17:00 и 18:00 по Московскому времени.");
        return 0; // Если сейчас между 17:00 и 18:00, возвращаем 0 миллисекунд
      } else {
        // Создаем объект Date для следующих 17:00
        const nextSeventeen = new Date(now);
        nextSeventeen.setHours(14, 0, 0, 0); // Устанавливаем время на 17:00

        // Если текущее время после 17:00, добавляем 1 день
        if (hours > 14 || (hours === 14 && minutes >= 0)) {
          nextSeventeen.setDate(nextSeventeen.getDate() + 1);
        }

        // Вычисляем время до следующих 17:00 в миллисекундах
        const timeToNext = nextSeventeen.getTime() - now.getTime();

        return timeToNext; // Возвращаем время в миллисекундах
      }
    }



    async refresh() {
            // Пример использования
        const timeInMilliseconds = this.getTimeToNextSeventeenInMilliseconds();
        console.log(`Время до следующих 17:00 по Московскому времени: ${timeInMilliseconds} миллисекунд.`);

        if (timeInMilliseconds == 0) {
            this._elements.timer.style.display = 'none';
            this._elements.timer_button.style.background = 'var(--Theme__block__background_accent)';
            this._elements.present.style.display = 'block';
        }
        else {
            this._elements.present.style.display = 'none';
            this._elements.timer.duration = timeInMilliseconds;
            this._elements.timer.start();
        }
    }
}
