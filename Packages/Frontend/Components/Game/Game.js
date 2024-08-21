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
            enum: ['Dino', 'Dack'],
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

    _renderer = new Units.Renderer({render: this._render.bind(this)});
    _rest = new RestClient(new URL(`../../../../Packages/Backend/Game_manager/Game_manager`, location));


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


    _init() {
        this.props__sync();
    }

    async _hero__load() {
        let hero_url = import.meta.url + `/../Storage/${this.hero}/${this.level}.webm`;
        this._elements.hero_source.src = hero_url;

        this._elements.hero.load();
    }

    async _hero__refresh() {
        await this._hero__load();

        if (!this.disabled) {
            this._elements.hero.play();
        }
    }

    async _points__on_pointerUp(event) {
        if (this.disabled) return;

        this._renderer.start();

        let point = new Point();
        this._elements.points.append(point);
        await point._built;
        point.position_initial.x = event.offsetX;
        point.position_initial.y = event.offsetY;
        point.position.set_vector(point.position_initial);
        point.velocity.y = -100;
        point.profit = this.level;

        let tg_id = 0;

        // this._rest.call('on_tap', tg_id)
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
