var _        = require('lodash'),
    packer   = require('../../src/pack'),
    unpacker = require('../../src/unpack'),
	jsonData = require('../medium-data')(),
	data     = packer.pack(jsonData);

module.exports = {
    lines: function(test) {
        test.expect(1);

        var lines = data.split('\n');

        test.ok(lines.length > 2, 'incorrect number of lines exist');

        test.done();
    },

    unzipCount: function(test) {
        test.expect(2);

        var count = data.split('\n').shift();
        test.ok(!!count, 'count does not exist');
        test.ok(_.isNumber(unpacker.counter(count)), 'count is not a number');

        test.done();
    },

    unzipLegend: function(test) {
        test.expect(2);

        var lines = data.split('\n'),
            legend = unpacker.unzipLegend(lines[1]);
        test.ok(!!legend, 'legend does not exist');
        test.ok(_.size(legend), 'legend does not contain values');

        test.done();
    },

    expandLine: function(test) {
        test.expect(2);

        var lines  = data.split('\n'),
            count  = unpacker.counter(lines.shift()),
            legend = unpacker.unzipLegend(lines.shift()),
            unzippedCode = unpacker.unzipAndExpandCode(legend, lines, count);

        var line = lines[0].split(' ');
        test.ok(!!line[0], 'line key does not exist');
        
        var lineData = unpacker.unzipAndExpandLine(legend, line[1], count);
        test.ok(lineData.length === count, 'line data is not the correct size');

        test.done();
    },

    unpack: function(test) {
        test.expect(1);

        var unpackedData = unpacker.unpack(data);
        test.deepEqual(unpackedData, jsonData, 'unpacked code does not match original data');

        test.done();
    }
};