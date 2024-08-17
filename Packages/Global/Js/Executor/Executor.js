// 26.07.2024


import {ExternalPromise} from '../ExternalPromise/ExternalPromise.js';


export class Executor {
    static _callbackHandlers = new Map();

    static _CallbackHandler = class {
        _callback_wrapped = this._callback_wrapped.bind(this);
        _promise = new ExternalPromise();
        _timeout_id = 0;


        callback = null;
        callback_args = [];
        callback_target = null;


        async _callback_wrapped() {
            let result = await this.callback.apply(this.callback_target, this.callback_args);

            console.log(result)

            this._promise.fulfill(result);
        }


        abort() {
            clearTimeout(this._timeout_id);
            this._promise.reject();
        }

        constructor({callback, callback_target} = {}) {
            this.callback = callback;
            this.callback_target = callback_target;
        }

        run() {
            if (this._timeout_id) return;

            this._timeout_id = setTimeout(this._callback_wrapped);
        }
    };


    static abort(callback_key) {
        let callbackHandler = this._callbackHandlers.get(callback_key);

        if (!callbackHandler) return;

        callbackHandler.abort();
        this._callbackHandlers.delete(callback_key);
    }

    static async call({
        callback,
        callback_args = [],
        callback_key = callback,
        callback_target = null,
    }) {
        let callbackHandler = this._callbackHandlers.get(callback_key);

        if (!callbackHandler) {
            callbackHandler = new this._CallbackHandler({callback, callback_target});
            this._callbackHandlers.set(callback_key, callbackHandler);
        }

        callbackHandler.callback_args = callback_args;
        callbackHandler.run();

        let callback_result = await callbackHandler._promise;
        this._callbackHandlers.delete(callback_key);

        return callback_result;
    }

    static async delay(time = 0) {
        await new Promise((fulfill) => setTimeout(fulfill, time));
    }

    static execute(js, args = {}) {
        try {
            return new Function(Object.keys(args), js)(...Object.values(args));
        }
        catch {}

        return null;
    }

    static execute_expression(js_expression, args = {}) {
        return this.execute(`return (${js_expression});`, args);
    }
}
