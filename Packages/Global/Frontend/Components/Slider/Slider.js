import {Component} from '../Component/Component.js';


export class Slider extends Component {
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        _animation_dir: {
            default: 0,
            enum: [-1, 1],
        },

        arrows: false,
        delay: 3e3,
        item_num: {
            default: -1,
            persistent: true,
        },
        points: false,
    };

    static _elements = {
        arrow_next: '',
        arrow_prev: '',
        points: '',
        root: '',
        template: '',
        slot: '',
    };

    static _eventListeners_elements = {
        arrow_next: {
            pointerdown: '_arrow_next__on_pointerDown',
        },
        arrow_prev: {
            pointerdown: '_arrow_prev__on_pointerDown',
        },
        points: {
            pointerdown: '_points__on_pointerDown',
        },
        slot: {
            animationend: '_slot__on_animationEnd',
        },
    };


    static {
        this.init();
    }


    _item_prev_num = null;
    _point = null;
    _timer = null;


    get _animation_dir() {
        return this._attributes._animation_dir;
    }
    set _animation_dir(animation_dir) {
        this._attribute__set('_animation_dir', animation_dir);
    }


    get arrows() {
        return this._attributes.arrows;
    }
    set arrows(arrows) {
        this._attribute__set('arrows', arrows);
    }

    get delay() {
        return this._attributes.delay;
    }
    set delay(delay) {
        this._attribute__set('delay', delay);
    }

    get points() {
        return this._attributes.points;
    }
    set points(points) {
        this._attribute__set('points', points);
    }

    get item_num() {
        return this._attributes.item_num;
    }
    set item_num(item_num) {
        if (!this.children.length || this._animation_dir) return;

        this._item_prev_num = this.item_num;
        let value = (this.children.length + item_num % this.children.length) % this.children.length || 0;

        this._attribute__set('item_num', value);

        if (this.item_num == this._item_prev_num) return;

        this.children[this.item_num].slot = 'item';
        this._elements.points.children[this.item_num].setAttribute('_active', true);

        if (this._item_prev_num == -1) return;

        this.children[this._item_prev_num].slot = 'item_prev';
        this._elements.points.children[this._item_prev_num].removeAttribute('_active');

        this._animation_dir = item_num > this._item_prev_num ? 1 : -1;
    }


    _arrow_next__on_pointerDown() {
        this.item_num++;
    }
    _arrow_prev__on_pointerDown() {
        this.item_num--;
    }

    _init() {
        this._point = this._elements.template.content.querySelector('.point');

        this.refresh();
    }

    _item_delayChange() {
        clearTimeout(this._timer);

        if (!this.delay) return;

        this._timer = setTimeout(() => this.item_num++, this.delay);
    }

    _points__on_pointerDown(event) {
        if (event.target == this._elements.points) return;

        this.item_num = event.target.num;
    }

    _points_create() {
        this._elements.points.textContent = '';

        for (let i = 0; i < this.children.length; i++) {
            let point = this._point.cloneNode(true);
            point.num = i;

            this._elements.points.append(point);
        }
    }

    _slot__on_animationEnd() {
        this.children[this._item_prev_num].slot = '';
        this._animation_dir = null;

        this._item_delayChange();
    }


    refresh() {
        this._animation_dir = 0;
        this._item_prev_num = -1;
        this._points_create();
        this.item_num = 0;

        this._item_delayChange();
    }
}
