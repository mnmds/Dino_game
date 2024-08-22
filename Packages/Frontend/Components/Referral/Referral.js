import {Components} from '../../../Global/Frontend/Frontend.js';


export class Referral extends Components.Component {
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        index: 0,
        image_url: '../referral/test_user_image.jpg',
        name: 'User',
        score: 0,
    };

    static _elements = {
        user_index: '',
        user_image: '',
        user_name: '',
        user_score: '',
    };

    static _eventListeners = {};


    static {
        this.init();
    }


    get index() {
        return this._attributes.index;
    }
    set index(index) {
        this._attribute__set('index', index);
        this._elements.user_index.textContent = index;
    }

    get image_url() {
        return this._attributes.image_url;
    }
    set image_url(image_url) {
        this._attribute__set('image_url', image_url);
        this._elements.user_image.src = image_url;
    }

    get name() {
        return this._attributes.name;
    }
    set name(name) {
        this._attribute__set('name', name);
        this._elements.user_name.textContent = name;
    }

    get score() {
        return this._attributes.score;
    }
    set score(score) {
        this._attribute__set('score', score);
        this._elements.user_score.textContent = score;
    }



    _init() {
        this.props__sync();
    }
}
