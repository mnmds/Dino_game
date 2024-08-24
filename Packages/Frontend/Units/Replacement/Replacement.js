// 24.08.2024


export class Replacement {
    __mapper_url =  new URL('./Localisation_enums.json', import.meta.url);


    _mapper = null;
    _mappers = {};
    _promise = null;
    _promise_resolve = null;


    permutation = '[_interface_name]';
    replace_object = 'eng';


    get mapper_url() {
        return this.__mapper_url;
    }
    set mapper_url(mapper_url) {
        this.__mapper_url = mapper_url;
        this._mapper__load();
    }


    async _mapper__load() {
        if (!this._mappers[this.mapper_url]) {
            this._promise = new Promise((resolve) => this._promise_resolve = resolve);
            let mapper = await fetch(this.mapper_url);
            this._mappers[this.mapper_url] = await mapper.json();
            this._promise_resolve();
        }

        this._mapper = this._mappers[this.mapper_url];
    }


    async replace(root) {
        await this._promise;

        if (!this._mapper) return;

        let elems = root.querySelectorAll(this.permutation);

        for (let elem of elems) {
            elem.textContent = this._mapper[this.replace_object][elem.getAttribute('_interface_name')];
        }
    }

    constructor() {
        this.mapper_url = this.mapper_url;
    }
}
