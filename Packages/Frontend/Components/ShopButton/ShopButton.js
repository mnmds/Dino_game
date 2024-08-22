import {Components} from '../../../Global/Frontend/Frontend.js';


export class ShopButton extends Components.Component {
    static _components = [Components.Svg];
    static _css_url = true;
    static _dom_slot = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        status: {
            default: 'sale',
            enum: ['sale', 'selected', 'sold'],
            persistent: true,
        }
    };


    static {
        this.init();
    }


    statuses_values = {
        sale: {
            icon_svg: './Storage/Images/Main.svg#crystal',
            text: '0',
        },
        selected: {
            icon_svg: '',
            text: 'Выбрано',
        },
        sold: {
            icon_svg: '',
            text: 'Куплено',
        },
    }


    get status() {
        return this._attributes.status;
    }
    set status(status) {
        this._attribute__set('status', status);
        this.status_value__refresh();
    }


    _init() {
        this.props__sync('status');
    }


    status_value__refresh() {
        this.innerHTML = '';

        if (this.statuses_values[this.status]['icon_svg']) {
            let icon_svg = new Components.Svg();
            icon_svg.url = this.statuses_values[this.status]['icon_svg'];

            this.append(icon_svg)
        }

        if (this.statuses_values[this.status]['text']) {
            let div = document.createElement('div');
            div.textContent = this.statuses_values[this.status]['text'];

            this.append(div)
        }
    }
}
