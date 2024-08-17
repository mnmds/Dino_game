import {A} from './A.js';


export class B extends A {
    static _interpolations = {
        data: {
            a: 'a',
            b: 'b',
        },
    };

    static _styleSheets_descriptors = {
        ...super._styleSheets_descriptors,

        dark: ['', false],
    };


    static {
        this.init();
    }
}
