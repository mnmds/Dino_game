import './Telegram_api.js';

// import {ExternalPromise} from '../ExternalPromise/ExternalPromise.js';
import {ExternalPromise} from '../../../Js/ExternalPromise/ExternalPromise.js';


export class Telegram {
    // static _result = null;
    static _telegram = window.Telegram;
    static _webApp = this._telegram.WebApp;

    static user = {id: 1571127511};
    // static user = this._webApp.initDataUnsafe.user;


    static app__init() {
        this._webApp.expand();
        this._webApp.ready();
    }

    static async data__get(key) {
        let promise = new ExternalPromise();
        this._webApp.CloudStorage.getItem(key, (error, success) => error ? promise.reject(error) : promise.fulfill(success));

        return promise;
    }

    static async data__remove(...args) {
        let promise = new ExternalPromise();
        this._webApp.CloudStorage.removeItems(args, (error, success) => error ? promise.reject(error) : promise.fulfill(success));

        return promise;
    }

    static async data__save(key, data) {
        let promise = new ExternalPromise();
        this._webApp.CloudStorage.setItem(key, value, (error, success) => error ? promise.reject(error) : promise.fulfill(success));

        return promise;
    }

    static link_outside__open(url) {
        this._webApp.openLink(url);
    }

    static link_telegram__open(url) {
        this._webApp.openTelegramLink(url);
    }

    // static user_id__get() {
    //     return this._webApp.initDataUnsafe.user.id;
    // }

    static verticalSwipes__disable() {
        this._webApp.disableVerticalSwipes();
    }

    static verticalSwipes__enable() {
        this._webApp.enableVerticalSwipes();
    }
}
