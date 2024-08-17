// 31.03.2024


export class EventManager extends EventTarget {
    static event__dispatch(eventTarget, event_name, event_detail = null) {
        let event_opts = {
            bubbles: true,
            cancelable: true,
            detail: event_detail,
        };
        let event = new CustomEvent(event_name, event_opts);

        return eventTarget.dispatchEvent(event);
    }

    static event_async__dispatch(eventTarget, event_name, event_detail = null) {
        setTimeout(() => this.event__dispatch(eventTarget, event_name, event_detail));
    }

    static eventListeners__add(eventTarget, eventListeners_descriptors) {
        return this.eventListeners__apply(eventTarget, eventListeners_descriptors);
    }

    static eventListeners__apply(eventTarget, eventListeners_descriptors, add = true) {
        let method = add ? 'addEventListener' : 'removeEventListener';

        for (let [event_name, eventListener_descriptor] of Object.entries(eventListeners_descriptors)) {
            if (!(eventListener_descriptor instanceof Array)) {
                eventListener_descriptor = [eventListener_descriptor];
            }

            eventTarget[method](event_name, ...eventListener_descriptor);
        }
    }

    static eventListeners__proc(target, eventListeners_descriptors, binding = false) {
        let eventListeners_descriptors_processed = {};

        for (let [key, value] of Object.entries(eventListeners_descriptors)) {
            if (value.constructor == Object) {
                value = this.eventListeners__proc(target, value, binding);
            }
            else {
                let eventListener_descriptor = value instanceof Array ? [...value] : [value];

                if (typeof eventListener_descriptor[0] == 'string') {
                    eventListener_descriptor[0] = target[eventListener_descriptor[0]];
                }

                if (!eventListener_descriptor[0]) continue;

                if (binding) {
                    eventListener_descriptor[0] = eventListener_descriptor[0].bind(target);
                }

                value = eventListener_descriptor;
            }

            eventListeners_descriptors_processed[key] = value;
        }

        return eventListeners_descriptors_processed;
    }

    static eventListeners_entries__apply(eventListeners_entries, add = true) {
        for (let [eventTarget, eventListeners_descriptors] of eventListeners_entries) {
            this.eventListeners__apply(eventTarget, eventListeners_descriptors, add);
        }
    }

    static eventListeners_entries__proc(target, eventListeners_entries, binding = false) {
        let eventListeners_entries_processed = [];

        for (let [eventTarget, eventListeners_descriptors] of eventListeners_entries) {
            let eventListeners_descriptors_processed = this.eventListeners__proc(target, eventListeners_descriptors, binding);
            eventListeners_entries_processed.push([eventTarget, eventListeners_descriptors_processed]);
        }

        return eventListeners_entries_processed;
    }

    static eventListeners_groups__apply(eventTargets, eventListeners_groups_descriptors, add = true) {
        for (let [eventTarget_name, eventTarget] of Object.entries(eventTargets)) {
            let eventListeners_descriptors = eventListeners_groups_descriptors[eventTarget_name];

            if (!eventListeners_descriptors) continue;

            this.eventListeners__apply(eventTarget, eventListeners_descriptors, add);
        }
    }

    static eventListeners__remove(eventTarget, eventListeners_descriptors) {
        return this.eventListeners__apply(eventTarget, eventListeners_descriptors, false);
    }


    _eventListeners__proc(eventListeners_descriptors, binding = false) {
        return this.constructor.eventListeners__proc(this, eventListeners_descriptors, binding);
    }

    _eventListeners_entries__proc(eventListeners_entries, binding = false) {
        return this.constructor.eventListeners_entries__proc(this, eventListeners_entries, binding);
    }


    event__dispatch(event_name, event_detail = null) {
        return this.constructor.event__dispatch(this, event_name, event_detail);
    }

    event_async__dispatch(event_name, event_detail = null) {
        return this.constructor.event_async__dispatch(this, event_name, event_detail);
    }

    eventListeners__add(eventListeners_descriptors) {
        return this.eventListeners__apply(eventListeners_descriptors);
    }

    eventListeners__apply(eventListeners_descriptors, add = true) {
        return this.constructor.eventListeners__apply(this, eventListeners_descriptors, add);
    }

    eventListeners__remove(eventListeners_descriptors) {
        return this.eventListeners__apply(eventListeners_descriptors, false);
    }
}
