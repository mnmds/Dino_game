import {Component} from '../../Component/Component.js';


export class A extends Component {
    static _html_url = './A.html';
    static _url = import.meta.url;

    static _styleSheets_descriptors = {
        dark: new URL('../../../Themes/Component/Dark.css', import.meta.url),
        light: [new URL('../../../Themes/Component/Light.css', import.meta.url), !false],
    };


    static {
        this.init();
    }


    // _init() {
    //     let observer = new MutationObserver((mutationRecords) => {
    //         console.log(mutationRecords);
    //     });
    //     let observer_opts = {
    //         childList: true,
    //         subtree: true,
    //     };
    //     observer.observe(this, observer_opts);
    //     observer.observe(this._shadow, observer_opts);
    // }
}
