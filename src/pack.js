var _             = require('./utils'),
    tokens        = require('./tokens'),
    DELIMITER     = require('./delimiter'),

    NUM_TO_TOKEN  = tokens,
    MAX_TOKEN     = tokens.size,
    
    // streak = (n_z), which makes a 4 character
    // minimum to put a streak in place. dont allow
    // streaks less than or equal to 4 or we'll have
    // a loss in savings
    MIN_STREAK_COUNT = 5,

    NEW_LINE         = '\n';

var generateCountMap = function(data, count) {
    var idx = 0,
        map = {},
        length = count,
        value, node, key;
    for (; idx < length; idx++) {
        node = data[idx];
        for (key in node) {
            value = node[key];

            // final token map: anything < 10 isn't valid
            if (value > 9) {
                map[value] = (map[value] || 0) + 1;
            }
        }
    }

    return map;
};

var trimCountMap = function(map) {
    var key;
    for (key in map) {
        // not used enough times
        // to warrant being in the map
        if (map[key] < 2) {
            delete map[key];
        }
    }
    return map;
};

var prioritizeTokens = function(map) {
    // calculate savings
    var key;
    for (key in map) {
        map[key] = key.length * map[key];
    }

    // Object.keys is so fast, that it's
    // faster to use it here than to create
    // a new array above when calculating
    // the savings
    var sortedArr = Object.keys(map)
        .sort(function(keyA, keyB) {
            var a = map[keyA],
                b = map[keyB];

            return a === b ? 0 :
                a > b ? -1 :
                1;
        });
    
    var numArr = _.fastmap(sortedArr, function(str) {
        return +str;
    });

    return numArr.length > MAX_TOKEN ? numArr.slice(0, MAX_TOKEN) : numArr;
};

var generateTokenMap = function(tokens) {
    var map = {},
        idx = 0, length = tokens.length;
    for (; idx < length; idx++) {
        map[tokens[idx]] = [tokens[idx], NUM_TO_TOKEN[idx]];
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

        if (num < MAX_TOKEN) {
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

var generateLineMap = function(obj, count) {
    var set = {},
        key;
    for (key in obj) {
        set[key] = new Array(count);
    }
    return set;
};

var populateLineMap = function(data, map, count) {
    var idx = 0, length = count,
        node, key;
    for (; idx < length; idx++) {
        node = data[idx];
        for (key in node) {
            map[key][idx] = node[key];
        }
    }

    return map;
};

var zipLines = function(tokenMap, lineData, count) {
    var lines = [],
        key;
    for (key in lineData) {
        lines.push(
            key + ' ' + zipLine(tokenMap, lineData[key], count)
        );
    }
    return lines;
};

var createStreak = function(tokenMap, num, currentStreak) {
    var token = tokenMap[num] !== undefined ? 
            tokenMap[num][1] : 
            num,

        streakToken = NUM_TO_TOKEN[currentStreak] !== undefined ? 
            NUM_TO_TOKEN[currentStreak] : 
            currentStreak.toString(32);

    return '('+ streakToken + DELIMITER + token +')';
};

var extendNumericCode = function(code, num, currentStreak) {
    var str = '';
    // does not have a token - hard
    if (_.isDigit(code[code.length - 1])) {
        str += DELIMITER;
    }

    while (currentStreak--) {
        if (currentStreak === 0) {
            str += num;
            continue;
        }

        str += num + DELIMITER;
    }

    return str;
};

var zipLine = function(tokenMap, line, count) {
    // token map: { '1234': [1234, '$'] }
    // line: [1,2,3]

    var undef,

        code = '',
        idx = 1, length = count,
        
        token,
        streakToken,

        currentStreak = 1,

        prevNum,
        num;
    for (; idx < length; idx++) {
        num = line[idx];
        prevNum = line[idx -1];

        // we're on a streak
        if (num === prevNum) {
            currentStreak++;
            continue;
        }

        // we've broken the streak
        if (currentStreak < MIN_STREAK_COUNT) {
            token = tokenMap[prevNum] !== undef ? tokenMap[prevNum][1] : undef;
            
            // has a token - easy
            if (token !== undef) {
                while (currentStreak--) {
                    code += token;
                }
            } else if (currentStreak === 1) {
                // does not have a token - harder
                if (_.isDigit(code[code.length - 1])) {
                    code += DELIMITER;
                }
                code += prevNum;
            } else {
                // does not have a token - but has a streak - hard
                code += extendNumericCode(code, prevNum, currentStreak);
            }

            currentStreak = 1;
            continue;
        }

        // create a streak
        code += createStreak(tokenMap, prevNum, currentStreak);
        currentStreak = 1;
    }

    // clean up the leftover streak
    if (currentStreak < MIN_STREAK_COUNT) {
        token = tokenMap[num] !== undef ? tokenMap[num][1] : undef;
        
        // has a token - easy
        if (token !== undef) {
            while (currentStreak--) {
                code += token;
            }
        } else if (currentStreak === 1) {
            // does not have a token - harder
            if (_.isDigit(code[code.length - 1])) {
                code += DELIMITER;
            }
            code += num;
        } else {
            // does not have a token - but has a streak - hard
            code += extendNumericCode(code, num, currentStreak);
        }

    } else {
        // create a streak
        code += createStreak(tokenMap, num, currentStreak);
    }

    return code;
};

var pack = function(data) {
    var count           = data.length,
        
        // token mapping
        countMap        = generateCountMap(data, count),
        trimmedCountMap = trimCountMap(countMap),
        tokens          = prioritizeTokens(trimmedCountMap),
        tokenMap        = generateTokenMap(tokens),

        // legend
        legend          = generateLegend(tokenMap),

        // data splitting
        lineMap         = generateLineMap(data[0], count),
        lineData        = populateLineMap(data, lineMap, count),
        codeLines       = zipLines(tokenMap, lineData, count),

        minCount        = count < MAX_TOKEN ? NUM_TO_TOKEN[count] : count.toString(32);

    return minCount + NEW_LINE + legend + NEW_LINE + codeLines.join(NEW_LINE);
};

module.exports = {
    /* debug: start */
    generateCountMap:   generateCountMap,
    trimCountMap:       trimCountMap,
    prioritizeTokens:   prioritizeTokens,
    generateTokenMap:   generateTokenMap,
    generateLegend:     generateLegend,
    generateLineMap:    generateLineMap,
    populateLineMap:    populateLineMap,
    zipLines:           zipLines,
    zipLine:            zipLine,
    /* debug: end */

    pack:              pack
};
