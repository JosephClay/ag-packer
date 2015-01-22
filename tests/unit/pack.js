var _       = require('lodash'),
    packer  = require('../../src/pack'),
    dataGen = require('../medium-data');

module.exports = {
    /**
     * Pulls the values of the objects
     * and flat lists them into an array
     */
    pickValues: function(test) {
        test.expect(4);

        var data         = dataGen(),
            valuesPerObj = 5,
            dataLength   = data.length,
            values       = packer.pickValues(data);

        test.ok(!!values, 'values do not exist');
        test.ok(Array.isArray(values), 'values was not an array');
        test.ok(values.length === (dataLength * valuesPerObj), 'not all values are accounted for');

        var areAllNumbers = true;
        values.forEach(function(val) {
            if (isNaN(+val)) { areAllNumbers = false; }
        });
        test.ok(areAllNumbers, 'not all values are numbers');

        test.done();
    },

    /**
     * Takes the values and tallies the usages of
     * each value in a hash
     */
    tokenCountMap: function(test) {
        test.expect(2);

        var data = [ 890, 42, 124, 45, 1, 890, 42, 126, 45, 1, 890, 42, 132, 45, 1 ],
            map = packer.tokenCountMap(data),
            expectedMap = {
                890: 3,
                42:  3,
                124: 1,
                45:  3,
                126: 1,
                132: 1,
                1:   3
            };

        test.ok(!!map, 'map does not exist');
        test.deepEqual(map, expectedMap, 'map is not same as expected');

        test.done();
    },

    /**
     * Removes from the map all values that
     * are less than 2, as those tokens are
     * unique so there's no reason to have
     * them in the legend
     */
    removeSmallValues: function(test) {
        test.expect(2);

        var data = {
                890: 3,
                42:  3,
                124: 1,
                45:  3,
                126: 1,
                132: 1,
                1:   3
            },
            map = packer.removeSmallValues(data),
            expectedMap = {
                890: 3,
                42:  3,
                45:  3,
                1:   3
            };

        test.ok(!!map, 'map does not exist');
        test.deepEqual(map, expectedMap, 'map is not same as expected');

        test.done();
    },

    /**
     * Removes from the map all keys that
     * are shorter than 2, as those tokens
     * are small enough that there's no reason
     * to have them in the legend
     */
    removeShortTokens: function(test) {
        test.expect(2);

        var data = {
                890: 3,
                42:  3,
                45:  3,
                1:   3
            },
            map = packer.removeShortTokens(data),
            expectedMap = {
                890: 3,
                42:  3,
                45:  3
            };

        test.ok(!!map, 'map does not exist');
        test.deepEqual(map, expectedMap, 'map is not same as expected');

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
            arr = packer.prioritize(data),
            expectedArr = [
                10,
                45,
                8900,
                420
            ];

        test.ok(!!arr, 'arr does not exist');
        test.deepEqual(arr, expectedArr, 'arr is not same as expected');

        test.done();
    },

    /**
     * Safeguard: only pick as many tokens
     * as we have alpha-symbolic keys to
     * represent
     */
    pickMax: function(test) {
        test.expect(2);

        var data = [
                '8900',
                '420',
                '45',
                '1'
            ],
            arr = packer.pickMax(data),
            expectedArr = [
                '8900',
                '420',
                '45',
                '1'
            ];

        test.ok(!!arr, 'arr does not exist');
        test.deepEqual(arr, expectedArr, 'arr is not same as expected');

        test.done();
    },

    /**
     * Pairs up the tokens to their
     * alpha-symbolic values
     */
    generateTokenMap: function(test) {
        test.expect(1);

        var data           = dataGen(),
            values         = packer.pickValues(data),
            basicTokenMap  = packer.tokenCountMap(values),
            largerTokenMap = packer.removeSmallValues(basicTokenMap),
            longerTokenMap = packer.removeShortTokens(largerTokenMap),
            sortedTokens   = packer.prioritize(longerTokenMap),
            tokens         = packer.pickMax(sortedTokens),
            tokenLength    = tokens.length,
            tokenMap       = packer.generateTokenMap(tokens);

        test.ok(_.keys(tokenMap).length === tokenLength, 'map is incorrect size');

        test.done();
    },

    /**
     * Creates the legend string from the token map
     */
    generateLegend: function(test) {
        test.expect(2);

        var data           = dataGen(),
            values         = packer.pickValues(data),
            basicTokenMap  = packer.tokenCountMap(values),
            largerTokenMap = packer.removeSmallValues(basicTokenMap),
            longerTokenMap = packer.removeShortTokens(largerTokenMap),
            sortedTokens   = packer.prioritize(longerTokenMap),
            tokens         = packer.pickMax(sortedTokens),
            tokenMap       = packer.generateTokenMap(tokens),
            legend         = packer.generateLegend(tokenMap);

        test.ok(!!legend, 'no legend exists');
        test.ok(_.isString(legend), 'legend is not a string');

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
        test.ok(code.split('\n').length === 3, 'code does not contain a keyset, legend and payload');

        test.done();
    }
};