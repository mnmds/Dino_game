// 25.09.2019; 01.04.2024


import {Executor} from '../Executor/Executor.js';


export class Class {
    static _class__copy(TargetClass, SourceClass) {
        let propertyDescriptors = Object.getOwnPropertyDescriptors(SourceClass.prototype);
        let propertyDescriptors_static = Object.getOwnPropertyDescriptors(SourceClass);
        delete propertyDescriptors_static.prototype;

        Object.defineProperties(TargetClass, propertyDescriptors_static);
        Object.defineProperties(TargetClass.prototype, propertyDescriptors);
    }

    static _inheritanceChain__get(Class, classes_count = 1) {
        let inheritanceChain = [];

        while (Class.prototype && inheritanceChain.length < classes_count) {
            inheritanceChain.push(Class);
            Class = Object.getPrototypeOf(Class);
        }

        inheritanceChain.reverse();

        return inheritanceChain;
    }


    static extract(object, path) {
        let aim = object;
        let props = path.split('.');

        for (let prop of props) {
            if (!(aim instanceof Object)) return undefined;

            aim = aim[prop];
        }

        return aim;
    }

    static mix(Class, ...mixins_descriptors) {
        for (let mixin_descriptor of mixins_descriptors) {
            if (!(mixin_descriptor instanceof Array)) {
                mixin_descriptor = [mixin_descriptor];
            }

            let inheritanceChain = this._inheritanceChain__get(...mixin_descriptor);

            for (let ChainClass of inheritanceChain) {
                let chainClass_string = ChainClass.toString();
                let chainClass_body_string = chainClass_string.includes('[native code]') ? '' : chainClass_string.match(/{(.*)}/s)[1];
                Class = Executor.execute_expression(`class ${ChainClass.name} extends Class {${chainClass_body_string}}`, {Class});

                if (!chainClass_body_string) {
                    this._class__copy(Class, ChainClass);
                }
            }
        }

        return Class;
    }

    static mix_props(Class, ...mixins_descriptors) {
        for (let mixin_descriptor of mixins_descriptors) {
            if (!(mixin_descriptor instanceof Array)) {
                mixin_descriptor = [mixin_descriptor];
            }

            let inheritanceChain = this._inheritanceChain__get(...mixin_descriptor);

            for (let ChainClass of inheritanceChain) {
                Class = class Mixin extends Class {};
                this._class__copy(Class, ChainClass);
            }
        }

        return Class;
    }

    static props__create(object, props) {
        for (let [key, value] of Object.entries(props)) {
            if (value === undefined || object[key] === value) continue;

            object[key] = value;
        }
    }
}
