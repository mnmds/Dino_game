// 15.05.2024


import {RestClient} from '../RestClient/RestClient.js';


export class Auth {
    _restClient = new RestClient();
    _token = '';


    name = '';
    password = '';
    registration_data = {};


    _restClient_data__create() {
        return {
            name: this.name || undefined,
            password: this.password || undefined,
            token: this._token || undefined,
        };
    }

    _token__remove() {
        localStorage.removeItem('Auth.token');
    }

    _token__save() {
        localStorage.setItem('Auth.token', this._token);
    }


    constructor(url = '') {
        this._restClient.data__create = this._restClient_data__create.bind(this);
        this._restClient.url = url;

        this.token__restore();
    }

    async logIn() {
        let {result} = await this._restClient.call('logIn');

        this._token = result || '';
        this._token__save();
    }

    async logOut() {
        await this._restClient.call('logOut', this._token);

        this._token = '';
        this._token__remove();
    }

    async register() {
        let {result} = await this._restClient.call('register', this.registration_data);

        this._token = result || '';
        this._token__save();
    }

    token__restore() {
        this._token = localStorage.getItem('Auth.token') || '';
    }

    async verify() {
        if (!this._token) return false;

        let {result} = await this._restClient.call('verify');

        return !!result;
    }
}
