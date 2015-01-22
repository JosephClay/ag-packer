module.exports = {
    extend: function(base) {
        var args = arguments,
            idx = 1, length = args.length,
            key, merger;
        for (; idx < length; idx++) {
            merger = args[idx];

            for (key in merger) {
                base[key] = merger[key];
            }
        }

        return base;
    },

    isString: function(str) {
        return typeof str === 'string';
    },
    stringifyTheUnknown: function(data) {
        try {
            return JSON.stringify(data);
        } catch(e) {
            return '';
        }
    }
};
