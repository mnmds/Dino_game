import {Components} from '../../../Global/Frontend/Frontend.js';
import {Units} from '../../../Global/Frontend/Frontend.js';


export class Point extends Components.Component {
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        animation_duration: 800,
        animation_move_length: 3,
        profit: 1,
    };

    static _elements = {
        profit: ''
    };

    static {
        this.init();
    }


    _animation_move_length = 0;
    _renderer = new Units.Renderer({render: this._render.bind(this)});
    _strat_height = 0;


    get animation_duration() {
        return this._attributes.animation_duration;
    }
    set animation_duration(animation_duration) {
        this._attribute__set('animation_duration', animation_duration);
    }

    get animation_move_length() {
        return this._attributes.animation_move_length;
    }
    set animation_move_length(animation_move_length) {
        this._attribute__set('animation_move_length', animation_move_length);
    }

    get profit() {
        return this._attributes.profit;
    }
    set profit(profit) {
        this._attribute__set('profit', profit);
        this._elements.profit.textContent = `+ ${profit}`;
    }


    _init() {
        this.props__sync('animation_duration', 'animation_move_length', 'profit');

        this._animation_move_length = this._strat_height + this.animation_move_length;
        // this._animation_move_length = this.animation_move_length / this.animation_duration;

        this._renderer.start();
    }

    _render() {
        let opacity = 1.2 - this._renderer._duration / this.animation_duration;
        let top = this._animation_move_length - this._renderer._duration / this.animation_duration * 90;
        // let top = this._strat_height + this._animation_move_length * this._renderer._dt;

        this.css__set('opacity', opacity);
        this.css__set('top', top + 'px');

        if (this._renderer._duration < this.animation_duration) return;

        this._renderer.stop();
        this.remove();
    }

    constructor(x, y) {
        super();
        this._strat_height = y;

        this.css__set('left', x + 'px');
        this.css__set('top', y + 'px');
    }
}
