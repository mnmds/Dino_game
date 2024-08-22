// 29.07.2024


export class Http {
    static _responses = {};


    static async fetch_json(url, opts = {}) {
        let response = await fetch(url, opts);
        let response_data = await response?.json() || null;

        return response_data;
    }

    static async fetch_text(url, opts = {}) {
        let response = await fetch(url, opts);
        let response_data = await response?.text() || null;

        return response_data;
    }


    cache = false;
    url_base = undefined;


    constructor(opts = {}) {
        if (!opts) return;

        this.init(opts);
    }

    async fetch(url, opts = {}) {
        url = new URL(url, this.url_base);
        let response_promise = null;

        if (this.cache) {
            response_promise = this.constructor._responses[url];
        }

        if (!response_promise) {
            response_promise = fetch(url, opts).catch(() => null);

            if (this.cache) {
                this.constructor._responses[url] = response_promise;
            }
        }

        let response = (await response_promise)?.clone() || null;

        return response;
    }

    async fetch_json(url, opts = {}) {
        let response = await this.fetch(url, opts);
        let response_data = await response?.json() || null;

        return response_data;
    }

    async fetch_text(url, opts = {}) {
        let response = await this.fetch(url, opts);
        let response_data = await response?.text() || null;

        return response_data;
    }

    init({
        cache = this.cache,
        url_base = this.url_base,
    } = {}) {
        this.cache = cache;
        this.url_base = url_base;
    }
}
