var humanize = require('humanize-duration');

module.exports = function() {
    var start = process.hrtime(),
        end;

    var api = {
        start: function() {
            start = process.hrtime();
            return api;
        },
        end: function() {
            end = process.hrtime(start);
            return api;
        },
        ms: function() {
            return end[1] / 1000000 + (end[0] * 1000);
        },
        humanize: function() {
            var ms = this.ms();
            return ms <= 1000 ? (ms + ' ms') : humanize(ms);
        },
        reset: function() {
            start = process.hrtime();
            return api;
        }
    };

    return api;
};