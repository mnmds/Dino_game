import {Components} from '../../../Global/Frontend/Frontend.js';
import {Units} from '../../../Global/Frontend/Frontend.js';

import {RestClient} from '../../../Global/Js/Js.js';

import {Point} from '../Point/Point.js';


export class Game extends Components.Component {
    static _components = [Point];
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        disabled: false,
        hero: {
            default: 'Dino',
            persistent: true,
        },
        level: {
            default: 1,
            persistent: true,
            range: [1, 9],
        },
    };

    static _elements = {
        hero: '',
        hero_source: '',
        points: '',
    };

    static _eventListeners_elements = {
        points: {
            pointerup: '_points__on_pointerUp',
        },
    };


    static {
        this.init();
    }

    _handshaking = null;
    _promise = null;
    _promise_resolve = null;
    _renderer = new Units.Renderer({render: this._render.bind(this)});


    get disabled() {
        return this._attributes.disabled;
    }
    set disabled(disabled) {
        this._attribute__set('disabled', disabled);
        this._hero__refresh();
    }

    get hero() {
        return this._attributes.hero;
    }
    set hero(hero) {
        this._attribute__set('hero', hero);
        this._hero__refresh();
    }

    get level() {
        return this._attributes.level;
    }
    set level(level) {
        this._attribute__set('level', level);
        this._hero__refresh();
    }


    _handshaking__open() {
        if (this._handshaking?.readyState == 1) return;

        // this._promise_resolve = null;
        this._promise = new Promise((resolve) => this._promise_resolve = resolve);
        this._handshaking = new WebSocket('ws://127.0.0.1:8000');
        this._handshaking.addEventListener('close', this._handshaking__on_close.bind(this));
        this._handshaking.addEventListener('message', this._handshaking__on_message.bind(this));
        this._handshaking.addEventListener('open', this._handshaking__on_open.bind(this));
    }

    _handshaking__on_close() {
        // this._handshaking__open();
    }

    _handshaking__on_message(event) {
        let {result} = event.data;
        this._refresh(result);
    }

    _handshaking__on_open() {
        this._promise_resolve();
    }

    async _hero__load() {
        let hero_url = `./Storage/Videos/Game/${this.hero}/${this.level}.webm`;
        let poster_url = `./Storage/Images/Game/Stop.png`;
        this._elements.hero.poster = poster_url;
        this._elements.hero_source.src = hero_url;

        this._elements.hero.load();
    }

    async _hero__refresh() {
        await this._hero__load();

        if (!this.disabled) {
            this._elements.hero.play();
        }
    }

    _init() {
        this.props__sync();
        this._handshaking__open();
    }

    _refresh(detail) {
        this.event__dispatch('data__ping', detail)
    }

    async _points__create(x, y) {
        let point = new Point();
        this._elements.points.append(point);
        await point._built;
        point.position_initial.x = x;
        point.position_initial.y = y;
        point.position.set_vector(point.position_initial);
        point.velocity.y = -100;
        point.profit = this.level;
    }

    _points__on_pointerUp(event) {
        if (this.disabled || (window.innerWidth - event.x < 80)) return;

        this._renderer.start();
        this._points__create((event.x - 25), (event.y - 25));
        this._points__ping();
    }

    async _points__ping() {
        let tg_id = Units.Telegram.user?.id;

        await this._promise;

        if (this._handshaking.readyState != 1) {
            this._handshaking__open();
        }

        let data = {
            method: 'points__ping',
            method_args: [tg_id]
        }

        this._handshaking.send(JSON.stringify(data));
        this.event__dispatch('tap');
    }

    _render() {
        if (!this._elements.points.children.length) {
            this._renderer.stop();

            return;
        }

        for (let point of this._elements.points.children) {
            point.position.sum(point.velocity.clone().prod(this._renderer._dt));
            let position_diff = point.position_initial.y - point.position.y;

            point.css__set('top', point.position.y + 'px');
            point.css__set('left', point.position.x + 'px');
            point.css__set('opacity', 1 - position_diff / 100);

            if (position_diff > 100) {
                point.remove();
            }
        }
    }
}
