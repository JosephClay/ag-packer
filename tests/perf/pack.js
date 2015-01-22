var async        = require('async'),
    fs           = require('fs'),
    packer       = require('../../index'),
    stats        = require('vis-stat'),
    processClock = require('process-clock'),
    table        = [];

var runTest = function(name, rawJson, callback) {
    var rawData    = JSON.parse(rawJson),
        clock      = processClock(),
        packedData = packer.pack(rawData);
    
    clock.end();
    
    table.push({
        name:     name,
        size:     stats.size(packedData).humanizeBytes(),
        savings:  stats.savings(rawJson, packedData).humanizePercent(),
        time:     clock.humanize(),
        original: stats.size(rawJson).humanizeBytes()
    });

    callback();
};

module.exports = {
    load: function(test) {
        test.expect(1);

        async.eachSeries([
            { name: 'tiny',   path: './tests/data/tiny-data.json' },
            { name: 'small',  path: './tests/data/small-data.json' },
            { name: 'medium', path: './tests/data/medium-data.json' },
            { name: 'big',    path: './tests/data/big-data.json' },
            { name: 'sample', path: './tests/data/sample-data-raw.json' }
        ], function(config, callback) {

            runTest(
                config.name,
                fs.readFileSync(config.path).toString(),
                callback
            );

        }, function(err) {
            if (err) { console.error(err); }

            console.table(table);
            test.ok(true, 'ran the pack');
            test.done();
        });
    }
};