var fs     = require('fs'),

    MAX_INT  = 2147483647,
    MAX      = 2000000,
    INTERVAL = 100000,

    bytes = 0;

var readableBytes = (function() {
    var s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
    
    return function() {
        if (bytes === 0) { return '0 bytes'; }
        
        var e = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, e)).toFixed(2) + ' ' + s[e];
    };
}());

var log_progress = function(count) {
    var percAsDec = count / (MAX + 1),
        percNum   = percAsDec * 100;
        perc      = percNum.toFixed(2);

    console.log(perc + '% - size: ' + readableBytes() + ' - index: ' + count);
};

var generate = function() {
    var entries = [],
        idx     = MAX + 1,
        count   = 0,
        value;
    while (idx--) {
        
        value = count.toString(32);
        bytes += value.length;
        entries.push(value);

        if ((count % INTERVAL) === 0) { log_progress(count); }

        count++;
    }
    return entries;
};

console.log('saving...');
fs.writeFileSync('./data/zero-to-max-base32.txt', generate().join('\n'));
console.log('done...');