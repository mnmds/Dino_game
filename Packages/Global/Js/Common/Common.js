// 06.11.2022


export class Common {
    static identifier__to_camel(identifier) {
        return identifier.replace(/-([a-z])/gi, (match, char) => char.toUpperCase());
    }

    static identifier__to_hyphen(identifier) {
        return identifier.replace(/[A-Z]/g, '-$&').toLowerCase();
    }

    static in_range(value, value_min, value_max) {
        return value >= value_min && value <= value_max;
    }

    static in_range_strict(value, value_min, value_max) {
        return value > value_min && value < value_max;
    }

    static to_range(value, value_min, value_max) {
        return value < value_min ? value_min : (value > value_max ? value_max : value);
    }

    static to_ring(num, num_min, num_max) {
        let base = Math.max(num_min, num_max) - num_min + 1;

        return (base + (num - num_min) % base) % base + num_min;
    }
}
