var _            = require('./utils'),
    DELIMITER    = require('./delimiter'),
    tokens       = require('./tokens'),
    TOKEN_TO_NUM = tokens.numMap,
    NEW_LINE     = '\n';

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

// Unzip and expand in one pass
var unzipAndExpandCode = function(legend, code) {
    var undef,
        buffer    = '',
        hasBuffer = false,
        codeArr   = code.split(''),
        idx       = 0,
        length    = codeArr.length,
        zip       = [],
        cha;

    for (; idx < length; idx++) {
        cha = codeArr[idx];

        // if we encounter a delimiter, that's
        // an indication that we should push the
        // buffer and move on...we had two sequential
        // numbers in the pack
        if (cha === DELIMITER) {
            if (hasBuffer) {
                zip.push(+buffer);
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
                zip.push(+buffer);
                buffer = '';
                hasBuffer = false;
            }

            zip.push(
                legend[cha] === undef ? +cha : legend[cha]
            );
        }
    }

    // there may be items in the buffer
    // after looping, clean up the buffer
    if (hasBuffer) {
        zip.push(+buffer);
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

var formatCode = function(chunks, keyset) {
    var idx = 0, length = chunks.length;
    for (; idx < length; idx++) {

        var chunk = chunks[idx],
            i = 0, len = chunk.length,
            map = {};
        for (; i < len; i++) {
            map[keyset[i]] = chunk[i];
        }

        chunks[idx] = map;
    }
    return chunks;
};

var unpack = function(str) {
    var lines  = str.split(NEW_LINE),

        keysetLine = lines[0],
        keyset     = keysetLine.split(' '),

        legendLine = lines[1];
        legend     = unzipLegend(legendLine),

        codeLine     = lines[2],
        unzippedCode = unzipAndExpandCode(legend, codeLine),
        chunkedCode  = chunk(unzippedCode, keyset.length);


    return formatCode(chunkedCode, keyset);
};

module.exports = {
    /* debug: start */
    unzipLegend:        unzipLegend,
    unzipAndExpandCode: unzipAndExpandCode,
    chunk:              chunk,
    formatCode:         formatCode,
    /* debug: end */

    unpack:            unpack
};
