import {Components} from '../../../Global/Frontend/Frontend.js';


export class ShopButton extends Components.Component {
    static _components = [Components.Svg];
    static _css_url = true;
    static _dom_slot = true;
    static _url = import.meta.url;

    static _attributes = {
        ...super._attributes,

        _interface_name: '',

        status: {
            default: 'sale',
            enum: ['sale', 'selected', 'sold'],
            persistent: true,
        }
    };


    static {
        this.init();
    }


    __meta_data = null;


    statuses_values = {
        sale: {
            icon_svg: './Storage/Images/Main.svg#crystal',
            interface_name: 'shopButton__sale',
            text: '0',
        },
        selected: {
            icon_svg: '',
            interface_name: 'shopButton__selected',
            text: 'Выбрано',
        },
        sold: {
            icon_svg: '',
            interface_name: 'shopButton__sold',
            text: 'Куплено',
        },
    }


    get _interface_name() {
        return this._attributes._interface_name;
    }
    set _interface_name(interface_name) {
        this._attribute__set('_interface_name', interface_name);
    }


    get meta_data() {
        return this.__meta_data;
    }
    set meta_data(meta_data) {
        this.__meta_data = meta_data;
    }

    get status() {
        return this._attributes.status;
    }
    set status(status) {
        this._attribute__set('status', status);
        this.status_value__refresh();
    }


    _init() {
        // await this.props__sync('status');
    }


    async status_value__refresh() {
        this.innerHTML = '';

        if (this.statuses_values[this.status].icon_svg) {
            let icon_svg = new Components.Svg();
            this.append(icon_svg);
            await icon_svg._built;
            icon_svg.url = this.statuses_values[this.status].icon_svg;

        }

        if (this.statuses_values[this.status].text) {
            let div = document.createElement('div');
            div.textContent = this.statuses_values[this.status].text;

            this.append(div)
        }

        this._interface_name = this.statuses_values[this.status].interface_name;
    }
}
