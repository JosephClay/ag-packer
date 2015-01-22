var _        = require('lodash'),
    packer   = require('../../src/pack'),
    unpacker = require('../../src/unpack'),
	jsonData = require('../medium-data')(),
	data     = packer.pack(jsonData);

module.exports = {
    lines: function(test) {
        test.expect(1);

        var lines = data.split('\n');

        test.ok(lines.length === 3, 'incorrect number of lines exist');

        test.done();
    },

    unzipKeyset: function(test) {
        test.expect(3);

        var lines = data.split('\n'),
            keyset = lines[0].split(' ');
        test.ok(!!keyset, 'keyset does not exist');
        test.ok(Array.isArray(keyset), 'keyset is not an array');
        test.ok(keyset.length === 5, 'keyset is incorrect size');

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

    unzipAndExpandCode: function(test) {
        test.expect(3);

        var lines = data.split('\n'),

            legendLine = lines[1],
            legend     = unpacker.unzipLegend(legendLine),

            codeLine     = lines[2],
            code         = unpacker.unzipAndExpandCode(legend, codeLine);

        test.ok(!!code, 'code does not exist');
        test.ok(Array.isArray(code), 'code is not an array of values');
        test.ok(_.size(code), 'code does not contain values');

        test.done();
    },

    chunk: function(test) {
        test.expect(5);

        var lines  = data.split('\n'),

            keysetLine = lines[0],
            keyset     = keysetLine.split(' '),

            legendLine = lines[1],
            legend     = unpacker.unzipLegend(legendLine),

            codeLine     = lines[2],
            expandedCode = unpacker.unzipAndExpandCode(legend, codeLine),

            code = unpacker.chunk(expandedCode, keyset.length);

        test.ok(!!code, 'code does not exist');
        test.ok(Array.isArray(code), 'code is not an array of values');
        test.ok(_.size(code), 'code does not contain values');
        test.ok(Array.isArray(code[0]), 'code is not an array of arrays');
        test.ok(code.length === jsonData.length, 'code is not the correct size to match the data');

        test.done();
    },

    formatCode: function(test) {
        test.expect(5);

        var lines  = data.split('\n'),

            keysetLine = lines[0],
            keyset     = keysetLine.split(' '),

            legendLine = lines[1],
            legend     = unpacker.unzipLegend(legendLine),

            codeLine     = lines[2],
            expandedCode = unpacker.unzipAndExpandCode(legend, codeLine),
            chunkedCode  = unpacker.chunk(expandedCode, keyset.length),
            code         = unpacker.formatCode(chunkedCode, keyset);

        test.ok(!!code, 'code does not exist');
        test.ok(Array.isArray(code), 'code is not an array of values');
        test.ok(_.size(code), 'code does not contain values');
        test.ok(code.length === jsonData.length, 'code is not the correct size to match the data');
        test.deepEqual(code, jsonData, 'unpacked code does not match original data');

        test.done();
    },

    unpack: function(test) {
        test.expect(1);

        var unpackedData = unpacker.unpack(data);
        test.deepEqual(unpackedData, jsonData, 'unpacked code does not match original data');

        test.done();
    }
};