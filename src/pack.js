var _             = require('./utils'),
    tokens        = require('./tokens'),
    TOKENS        = tokens.tokens,
    TOKENS_LENGTH = TOKENS.length,
    NUM_TO_TOKEN  = tokens.valueMap,
    MAX_VALUE     = tokens.maxValue,
    DELIMITER     = require('./delimiter'),
    NEW_LINE      = '\n';

/* debug: start */
var pickValues = function(data) {
    var idx = 0,
        length = data.length,
        // preallocating this array
        // is slower when having to keep
        // a count object and adding
        // directly to an index
        arr = [],
        node, key;
    for (; idx < length; idx++) {
        node = data[idx];
        for (key in node) {
            arr.push(node[key]);
        }
    }
    return arr;
};

var tokenCountMap = function(values) {
    var map = {},
        idx = values.length,
        num;
    while (idx--) {
        num = values[idx];
        map[num] = (map[num] || 0) + 1;
    }
    return map;
};
/* debug: end */

var pickValuesAndCount = function(data) {
    var idx = 0,
        map = {},
        length = data.length,
        // preallocating this array
        // is slower when having to keep
        // a count object and adding
        // directly to an index
        values = [],
        value, node, key;
    for (; idx < length; idx++) {
        node = data[idx];
        for (key in node) {
            value = node[key];
            values.push(value);
            map[value] = (map[value] || 0) + 1;
        }
    }

    return {
        values: values,
        map: map
    };
};

// made specifically to reduce looping:
// removeSmallValues removeShortTokens keysToNum pickMax
var trimTokenMap = function(map) {
    for (var key in map) {
        // removeSmallValues && removeShortTokens
        if (map[key] < 2 || key.length < 2) {
            delete map[key];
        }
    }

    var arr = prioritize(map);

    // pickMax
    return arr.length > TOKENS_LENGTH ? arr.slice(0, TOKENS_LENGTH) : arr;
};

var prioritize = function(obj) {
    var key;
    for (key in obj) {
        obj[key] = key.length * obj[key];
    }

    // Object.keys is so fast, that it's
    // faster to use it here than to create
    // a new array above when calculating
    // the savings
    var arr = Object.keys(obj)
        .sort(function(keyA, keyB) {
            var a = obj[keyA],
                b = obj[keyB];

            return a === b ? 0 :
                a > b ? -1 :
                1;
        });
    
    return _.fastmap(arr, function(str) {
        return +str;
    });
};

/* debug: start */
var removeSmallValues = function(map) {
    return Object.keys(map)
        .reduce(function(obj, key) {
            var value = map[key];
            if (value < 2) { return obj; }
            obj[key] = value;
            return obj;
        }, {});
};

var removeShortTokens = function(map) {
    return Object.keys(map)
        .reduce(function(obj, key) {
            if (key.length < 2) { return obj; }
            obj[key] = map[key];
            return obj;
        }, {});
};

var pickMax = function(arr) {
    return arr.length > TOKENS_LENGTH ? arr.slice(0, TOKENS_LENGTH) : arr;
};
/* debug: end */

var generateTokenMap = function(tokens) {
    var map = {},
        idx = 0, length = tokens.length;
    for (; idx < length; idx++) {
        map[tokens[idx]] = [tokens[idx], TOKENS[idx]];
    }
    return map;
};

var generateLegend = function(tokenMap) {
    // token map: { '1234': [1234, '$'] }

    var tokens = '',
        placement,
        token,
        num,
        key;
    for (key in tokenMap) {
        token = tokenMap[key];
        num = token[0];

        if (num < MAX_VALUE) {
            num = NUM_TO_TOKEN[num];
        } else {
            num = num.toString(32);
        }

        tokens += (token[1] + num + ' ');
    }

    // trim the last ' '
    tokens.substr(0, tokens.length - 1);

    return tokens;
};

var generateZippedCode = function(tokenMap, values) {
    // token map: { '1234': [1234, '$'] }
    // values: [123, 456, 789, ...]

    var str = '',
        idx = 0, length = values.length,
        val, token;
    for (; idx < length; idx++) {
        val = values[idx];
        token = tokenMap[val];

        // a token is available for this
        // number, put it into the str
        if (token) {
            str += token[1];
            continue;
        }

        // it's a number, check to see if the previous
        // value is a number as well and add a delimiter
        if (idx !== 0 && !tokenMap[values[idx - 1]]) {
            // a delimiter is needed between
            // these two numbers
            str += DELIMITER;
        }

        str += val;
    }
    return str;
};

var pack = function(data) {
    var pickAndCount   = pickValuesAndCount(data),
        values         = pickAndCount.values,
        basicTokenMap  = pickAndCount.map,
        tokens         = trimTokenMap(basicTokenMap),
        tokenMap       = generateTokenMap(tokens),
        legend         = generateLegend(tokenMap),
        code           = generateZippedCode(tokenMap, values),
        keyset         = Object.keys(data[0]).join(' ');

    return keyset + NEW_LINE + legend + NEW_LINE + code;
};

module.exports = {
    /* debug: start */
    pickValues:         pickValues,
    tokenCountMap:      tokenCountMap,
    removeSmallValues:  removeSmallValues,
    removeShortTokens:  removeShortTokens,
    prioritize:         prioritize,
    pickMax:            pickMax,
    generateTokenMap:   generateTokenMap,
    generateLegend:     generateLegend,
    generateZippedCode: generateZippedCode,
    /* debug: end */

    pack:              pack
};
