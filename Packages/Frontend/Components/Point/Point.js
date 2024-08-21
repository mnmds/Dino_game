import {Components} from '../../../Global/Frontend/Frontend.js';
import {Vector_2d} from '../../../Global/Js/Js.js';


export class Point extends Components.Component {
    static _css_url = true;
    static _html_url = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        profit: 1,
    };

    static _elements = {
        profit: ''
    };

    static {
        this.init();
    }


    position = new Vector_2d();
    position_initial = new Vector_2d();
    velocity = new Vector_2d();


    get profit() {
        return this._attributes.profit;
    }
    set profit(profit) {
        this._attribute__set('profit', profit);
        this._elements.profit.textContent = `+ ${profit}`;
    }


    _init() {
        this.props__sync('profit');
    }
}
