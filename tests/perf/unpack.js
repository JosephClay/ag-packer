var async        = require('async'),
    fs           = require('fs'),
    packer       = require('../../index'),
    processClock = require('process-clock'),
    table        = [];

var runTest = function(name, packedData, callback) {
    var clock        = processClock(),
        unpackedData = packer.unpack(packedData);

    clock.end();

    table.push({
        type:    name,
        time:    clock.humanize()
    });

    callback();
};

module.exports = {
    fps: function(test) {
        test.expect(1);

        var data         = fs.readFileSync('./data/medium-data-packed.txt').toString(),
            clock        = processClock(),
            unpackedData = packer.unpack(data);

        test.ok(clock.end().ms() < 16, 'unpacked time was over time for 60fps: ' + clock.humanize());
        test.done();
    },
    load: function(test) {
        test.expect(1);

        async.eachSeries([
            { name: 'tiny',   path: './data/tiny-data-packed.txt' },
            { name: 'small',  path: './data/small-data-packed.txt' },
            { name: 'medium', path: './data/medium-data-packed.txt' },
            // { name: 'big',    path: './data/big-data-packed.txt' },
            // { name: 'sample', path: './data/sample-data-packed.txt' }
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