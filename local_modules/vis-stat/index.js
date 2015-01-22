var _     = require('./src/utils'),
    bytes = require('./src/bytes'),
    Num   = require('./src/Num');

module.exports = _.extend({}, bytes, {
    size: function(data) {
        if (!data) { return new Num(0); }

        var halfBytes = _.isString(data) ? data.length : _.stringifyTheUnknown(data).length;
        return new Num(halfBytes * 2);
    },

    savings: function(origStr, packedStr) {
        var origBytes = origStr.length,
            packedBytes = packedStr.length,
            percSavings = origBytes / packedBytes;
        return new Num(percSavings);
    }
});
