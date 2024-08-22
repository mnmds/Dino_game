import {Components} from '../../../Global/Frontend/Frontend.js';

import {ButtonBack} from '../ButtonBack/ButtonBack.js';
import {Referral} from '../Referral/Referral.js';


export class Referrals extends Components.Component {
    static _components = [Components.Flickable, Components.Repeater, Referral];
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,
    };

    static _elements = {
        repeater: '',
        display: '',
    };

    static _eventListeners = {};

    static Repeater_manager = class extends Components.Repeater.Manager {
        data__apply() {
            this._item.name = this._model_item.user_name;
            this._item.image_url = this._model_item.image_url;
            this._item.index = this._model_item.user_index;
            this._item.score = this._model_item.user_score;
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
                user_index: '123',
                image_url: '../referral/test_user_image.jpg',
                user_name: 'us',
                user_score: '232',
            },
            {
                user_index: '123',
                image_url: '../referral/test_user_image.jpg',
                user_name: 'us',
                user_score: '232',
            },
            {
                user_index: '123',
                image_url: '../referral/test_user_image.jpg',
                user_name: 'us',
                user_score: '232',
            },
            {
                user_index: '123',
                image_url: '../referral/test_user_image.jpg',
                user_name: 'us',
                user_score: '232',
            },
            {
                user_index: '123',
                image_url: '../referral/test_user_image.jpg',
                user_name: 'us',
                user_score: '232',
            },
            {
                user_index: '123',
                image_url: '../referral/test_user_image.jpg',
                user_name: 'us',
                user_score: '232',
            },
        ]);
    }
}
