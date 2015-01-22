var _            = require('./utils'),
    DELIMITER    = require('./delimiter'),
    tokens       = require('./tokens'),
    TOKEN_TO_NUM = tokens.numMap,
    NEW_LINE     = '\n',
    undef;

var unzipLegend = function(legend) {
    var map       = {},
        legendArr = legend.split(' '),
        idx = 0, length = legendArr.length,
        str, strLen, cha;
    for (; idx < length; idx++) {

        str = legendArr[idx];
        strLen = str.length;
        cha = str[0];
        
        map[cha] = strLen === 2 ? TOKEN_TO_NUM[str[1]] : parseInt(str.substr(1, strLen), 32);
    }
    return map;
};

var unzipAndExpandCode = function(legend, lines, count) {
    var lineData = {},
        idx = 0, length = lines.length,
        line;
    for (; idx < length; idx++) {
        line = lines[idx].split(' ');
        lineData[line[0]] = unzipAndExpandLine(legend, line[1], count);
    }
    return lineData;
};

var processStreak = function(arr, legend, streakStr, index) {
    var streak = streakStr.split(DELIMITER),
        times = streak[0],
        value = streak[1];

    times = times.length === 1 ?
        TOKEN_TO_NUM[times] :
        parseInt(times, 32);

    value = legend[value] !== undef ?
        legend[value] : 
        +value;

    while (times--) {
        arr[index] = value;
        index++;
    }

    return index;
};

var unzipAndExpandLine = function(legend, line, count) {
    var zip        = new Array(count),
        
        buffer     = '',
        hasBuffer  = false,
        
        index      = 0,
        idx        = 0,
        length     = line.length,
        
        streak     = '',
        isInStreak = false,

        cha;

    for (; idx < length; idx++) {
        cha = line[idx];

        if (!isInStreak && cha === '(') {
            isInStreak = true;
            continue;
        }

        if (isInStreak && cha === ')') {
            index = processStreak(zip, legend, streak, index);
            isInStreak = false;
            streak = '';
            continue;
        }

        if (isInStreak) {
            streak += cha;
            continue;
        }

        // if we encounter a delimiter, that's
        // an indication that we should push the
        // buffer and move on...we had two sequential
        // numbers in the pack
        if (cha === DELIMITER) {
            if (hasBuffer) {
                zip[index] = +buffer;
                index++;
                buffer = '';
                hasBuffer = false;
            }
            continue;
        }

        if (_.isDigit(cha)) {
            buffer += cha;
            hasBuffer = true;
        } else {
            // ran into a character, make sure the
            // buffer gets priority
            if (hasBuffer) {
                zip[index] = +buffer;
                index++;
                buffer = '';
                hasBuffer = false;
            }

            zip[index] = legend[cha] === undef ? +cha : legend[cha];
            index++;
        }
    }

    // shouldn't need to check for a streak here
    // as every streak should have an end

    // there may be items in the buffer
    // after looping, clean up the buffer
    if (hasBuffer) {
        zip[index] = +buffer;
    }

    return zip;
};

// Takes an array and chunks it some number of times into
// sub-arrays of size n. 
// 
// underscore-contrib has an implementation that allows
// padding as the third argument to fill in the tail chunk,
// but it was slow
// 
// next, I wrote a custom chunker based off of
// underscore-contrib but it has problems with very large 
// arrays as it was splicing:
// var chunk = function(arr, size) {
//     var arrays = [];
//     while (arr.length > 0) {
//         arrays.push(arr.splice(0, size));
//     }
//     return arrays;
// };
// 
// below is what I've ended up with so far:
/*
var chunk = function(arr, size) {
    var idx = 0, length = arr.length / size,
        arrays = new Array(length),
        pos;
    for (; idx < length; idx++) {
        pos = idx * size;
        arrays[idx] = arr.slice(pos, pos + size);
    }
    return arrays;
};
*/

var formatCode = function(lineData, count) {
    var data = new Array(count),
        idx = 0, length = count;
    for (; idx < length; idx++) {

        var obj = {};
        for (var key in lineData) {
            obj[key] = lineData[key][idx];
        }
        data[idx] = obj;

    }
    return data;
};

var counter = function(count) {
    return count.length === 1 ? TOKEN_TO_NUM[count] : parseInt(count, 32);
};

var unpack = function(str) {
    var lines        = str.split(NEW_LINE),
        count        = counter(lines.shift()),
        legend       = unzipLegend(lines.shift()),
        unzippedCode = unzipAndExpandCode(legend, lines, count);
    return formatCode(unzippedCode, count);
};

module.exports = {
    /* debug: start */
    unzipLegend:        unzipLegend,
    unzipAndExpandCode: unzipAndExpandCode,
    unzipAndExpandLine: unzipAndExpandLine,
    formatCode:         formatCode,
    counter:            counter,
    /* debug: end */

    unpack:            unpack
};
