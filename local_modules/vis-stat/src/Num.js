var bytes = require('./bytes'),
    BYTES_PER_KB = bytes.BYTES_PER_KB,
    BYTES_PER_MB = bytes.BYTES_PER_MB,
    BYTES_PER_GB = bytes.BYTES_PER_GB;

var Num = module.exports = function(num) {
    this._num = num || 0;
};
Num.prototype = {
    humanizeBytes: function() {
        var bytes = this._num;
        if (bytes < BYTES_PER_KB) { return bytes + ' b'; }
        if (bytes < BYTES_PER_MB) { return (bytes / BYTES_PER_KB).toFixed(3) + ' KB'; }
        if (bytes < BYTES_PER_GB) { return (bytes / BYTES_PER_MB).toFixed(3) + ' MB'; }
        return (bytes / BYTES_PER_GB).toFixed(3) + ' GB';
    },
    humanizePercent: function() {
        return (this._num * 100).toFixed(2) + '%';
    },
    valueOf: function() {
        return this._num;
    },
    toString: function() {
        return this._num.toString();
    },
    toJSON: function() {
        return this._num;
    }
};
