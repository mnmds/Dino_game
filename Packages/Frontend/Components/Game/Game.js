import {Components} from '../../../Global/Frontend/Frontend.js';
import {Point} from '../Point/Point.js';


export class Game extends Components.Component {
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

    static _eventListeners_target = {
        pointerup: '_on__pointerUp',
    };


    static {
        this.init();
    }


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
        let hero_url = `./Storage/${this.hero}/${this.level}.webm`;
        this._elements.hero_source.src = hero_url;

        this._elements.hero.load();
    }

    async _hero__refresh() {
        await this._hero__load();

        if (!this.disabled) {
            this._elements.hero.play();
        }
    }

    _on__pointerUp(event) {
        if (this.disabled) return;

        let point = new Point(event.offsetX, event.offsetY);
        this._elements.points.append(point);
        point.profit = this.level;

        this.event__dispatch('tap');
    }
}
