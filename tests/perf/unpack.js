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

        var data         = fs.readFileSync('./tests/data/medium-data-packed.txt').toString(),
            clock        = processClock(),
            unpackedData = packer.unpack(data);
    
        test.ok(clock.end().ms() < 16, 'unpacked time was over time for 60fps: ' + clock.humanize());
        test.done();
    },
    load: function(test) {
        test.expect(1);

        async.eachSeries([
            { name: 'tiny', path: './tests/data/tiny-data-packed.txt' },
            { name: 'small', path: './tests/data/small-data-packed.txt' },
            { name: 'medium', path: './tests/data/medium-data-packed.txt' },
            { name: 'big', path: './tests/data/big-data-packed.txt' },
            { name: 'sample', path: './tests/data/sample-data-packed.txt' }
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