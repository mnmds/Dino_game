// 24.08.2024


export class Interface_names_replacement {
    __mapper_url = '';
    // './Mappers/Interface_names_enums.js'


    _mapper = null;
    _mappers = {};
    _promise = null;
    _promise_resolve = null;


    replace_regExp = /{{(.*?)}}/;
    parameter_opt_mapper = 'eng';


    get mapper_url() {
        return this.__mapper_url;
    }
    set mapper_url(mapper_url) {
        this.__mapper_url = mapper_url;
        this._mapper__load();
    }


    async _mapper__load() {
        if (!this._mappers[this.mapper_url]) {
            // this._mappers[this.mapper_url] = await import(this.mapper_url);
            this._promise = new Promise((resolve) => this._promise_resolve = resolve);
            let mapper = await fetch(this.mapper_url); // завершается с заголовками ответа
            this._mappers[this.mapper_url] = await mapper.json();
            this._promise_resolve();
        }

        this._mapper = this._mappers[this.mapper_url];


    }

    // _tree__walk(elem) {
    //     if (!elem.children.length) {
    //         let replace_const = elem.textContent.match(replace_regExp);

    //         if (!replace_const) return;

    //         elem.textContent = this._mapper[this.parameter_opt_mapper][replace_const[1]];

    //         return;
    //     }

    //     for (let child of elem.children) {
    //         this._tree__walk(child);
    //     }
    // }

    // _replace(match, replace_const) {
    //     return this._mapper[this.parameter_opt_mapper][replace_const];
    // }

    // _tree__walk(root) {
    //     let elems = root.querySelectorAll('*');

    //     for (let elem of elems) {
    //         if (elem.children.length) continue;

    //         let replace_const = elem.textContent.match(this.replace_regExp);

    //         if (!replace_const) continue;

    //         elem.textContent = this._mapper[this.parameter_opt_mapper][replace_const[1]];
    //     }
    // }


    async replace(root) {
        await this._promise;

        if (!this._mapper) return;

        // root.innerHTML.replace(this.replace_regExp, this._replace.bind(this));

        let elems = root.querySelectorAll('[_interface_name]');

        for (let elem of elems) {
            elem.textContent = this._mapper[this.parameter_opt_mapper][elem.getAttribute('_interface_name')];
        }

        // this._tree__walk(root);
    }
}
