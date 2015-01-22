var _       = require('lodash'),
    packer  = require('../../src/pack'),
    dataGen = require('../medium-data');

module.exports = {
    generateCountMap: function(test) {
        test.expect(1);

        var data     = dataGen(),
            count    = data.length,
            countMap = packer.generateCountMap(data, count);

        test.ok(!!countMap, 'did not return a count map');

        test.done();
    },

    trimCountMap: function(test) {
        test.expect(2);

        var data = {
                'one': 1,
                'two': 100
            },
            count        = data.length,
            trimmedCountMap = packer.trimCountMap(data),
            expected = {
                'two': 100
            };

        test.ok(!!trimmedCountMap, 'did not return a timeed count map');
        test.deepEqual(expected, trimmedCountMap, 'count map was not trimmed as expected');

        test.done();
    },

    /**
     * Prioritize tokens based on characters saved.
     * This is done by taking the length of the
     * key and comparing it against the number of
     * times it's used
     */
    prioritizeTokens: function(test) {
        test.expect(2);

        var data = {
                10:   75,  // 10 * 75 = 750
                420:  5,   // 3 * 5   = 15
                8900: 10,  // 4 * 10  = 40
                45:   50   // 2 * 50  = 100
            },
            arr = packer.prioritizeTokens(data),
            expectedArr = [
                10,
                45,
                8900,
                420
            ];

        test.ok(!!arr, 'arr does not exist');
        test.deepEqual(arr, expectedArr, 'prioritization is not same as expected');

        test.done();
    },

    /**
     * Pairs up the tokens to their
     * alpha-symbolic values
     */
    generateTokenMap: function(test) {
        test.expect(1);

        var data           = dataGen(),
            count          = data.length,

            countMap        = packer.generateCountMap(data, count),
            trimmedCountMap = packer.trimCountMap(countMap),
            tokens          = packer.prioritizeTokens(trimmedCountMap),
            tokenMap        = packer.generateTokenMap(tokens);

        test.ok(_.keys(tokenMap).length, 'map was not generated');

        test.done();
    },

    /**
     * Creates the legend string from the token map
     */
    generateLegend: function(test) {
        test.expect(2);

        var data           = dataGen(),
            count          = data.length,

            countMap        = packer.generateCountMap(data, count),
            trimmedCountMap = packer.trimCountMap(countMap),
            tokens          = packer.prioritizeTokens(trimmedCountMap),
            tokenMap        = packer.generateTokenMap(tokens),

            // legend
            legend          = packer.generateLegend(tokenMap);

        test.ok(!!legend, 'no legend exists');
        test.ok(_.isString(legend), 'legend is not a string');

        test.done();
    },

    zipLine: function(test) {
        test.expect(2);

        var data           = dataGen(),
            count          = data.length,
        
            // token mapping
            countMap        = packer.generateCountMap(data, count),
            trimmedCountMap = packer.trimCountMap(countMap),
            tokens          = packer.prioritizeTokens(trimmedCountMap),
            tokenMap        = packer.generateTokenMap(tokens),

            // legend
            legend          = packer.generateLegend(tokenMap),

            // data splitting
            lineMap         = packer.generateLineMap(data[0], count),
            lineData        = packer.populateLineMap(data, lineMap, count);

        var firstKey = Object.keys(lineData)[0],
            line = lineData[firstKey],
            codeLine = packer.zipLine(tokenMap, line, count);

        test.ok(!!codeLine, 'no code line generated');
        test.ok(_.isString(codeLine), 'code line is not a string');

        test.done();
    },

    /**
     * Whole thing, begining to end
     */
    pack: function(test) {
        test.expect(4);

        var data = dataGen(),
            code = packer.pack(data);
        test.ok(!!code, 'code does not exist');
        test.ok(_.isString(code), 'code is not a string');
        test.ok(code.length < JSON.stringify(data).length, 'code is not smaller than the data');
        test.ok(code.split('\n').length > 2, 'code does not contain a count, legend and payload');

        test.done();
    }
};