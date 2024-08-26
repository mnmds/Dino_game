import {Components} from '../../../Global/Frontend/Frontend.js';
import {Units} from '../../../Global/Frontend/Frontend.js';


export class Timer extends Components.Component {
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        _progress: {
            default: 1,
            persistent: true,
        },


        duration: {
            default: 1e4,
            range: [0, Infinity],
        },
        text: '',
    }

    static _elements = {
        root: '',
        text: '',
        time_value: '',
    }





    static {
        this.init();
    }


    _date_stop = 0;
    // _remains_storage = '';
    _renderer = new Units.Renderer({render: this._render.bind(this)});


    get _progress() {
        return this._attributes._progress;
    }
    set _progress(progress) {
        this._attribute__set('_progress', progress);
        this._elements.root.style.setProperty('--_progress', progress);
    }

    get _remains() {
        return this._elements.time_value.textContent;
        // return this._remains_storage;
    }
    set _remains(remains) {
        this._elements.time_value.textContent = remains;
        // this._remains_storage = remains;
    }


    get duration() {
        return this._attributes.duration;
    }
    set duration(duration) {
        this._attribute__set('duration', duration);
        this._clear();
    }

    get text() {
        return this._attributes.text;
    }
    set text(text) {
        this._attribute__set('text', text);
        this._elements.text.textContent = text;
    }


    _clear() {
        this._progress = 1;
        this._remains = this._time_formatted__get(this.duration);
    }

    _init() {
        this.props__sync('_progress', 'duration');
    }

    _render() {
        this._progress = 1 - this._renderer._duration / this.duration;
        this._remains = this._time_formatted__get(this.duration - this._renderer._duration);

        // console.log(this._renderer._active, this._renderer._duration, this._progress)

        if (this._renderer._duration < this.duration) return;

        this.stop();
    }

    _time_formatted__get(time) {
        time = new Date(time);
        let milliseconds = Math.trunc(time.getMilliseconds() / 10);
        let minutes = time.getMinutes() > 9 ? time.getMinutes() : `0${time.getMinutes()}`;
        let seconds = time.getSeconds() > 9 ? time.getSeconds() : `0${time.getSeconds()}`;
        milliseconds = milliseconds > 9 ? milliseconds : `0${milliseconds}`;

        return `${minutes}:${seconds}:${milliseconds}`;
    }


    pause() {
        this._renderer.stop();
    }

    resume() {
        this._renderer.start(true);
    }

    start() {
        this._clear();
        this._renderer.start();

        this.event__dispatch('start');
    }

    stop() {
        this._progress = 0;
        this._remains = this._time_formatted__get(0);
        this._renderer.stop();

        this.event__dispatch('stop');
    }
}
