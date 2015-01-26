// takes roughly 44ms to generate this data

var ITERATIONS = 65536,

	flatten = function(array) {
		var arr = [],
			idx = array.length;
		while (idx--) {
			if (Array.isArray(array[idx])) {
				arr = arr.concat(array[idx]);
			} else {
				arr.push(array[idx]);
			}
		}
		return arr;
	},
	range = function(min, max) {
		var arr = [],
			idx = min, length = max + 1;
		for (; idx < length; idx++) {
			arr.push(idx);
		}
		return arr;
	},

	// blacklisted char codes
	blacklist = flatten([
		// misc bad characters
		range(55296, 57343),
		12288,
		8233, 8232, 
		8287,
		8239,
		range(8192, 8202),
		6158,
		5760,
		160,
		133,

		// numpad 0 - 9
		range(96, 105),
		// _
		95,
		// 0 - 9
		range(48, 57),

		// -
		45,
		// ( )
		40, 41,
		// ' '
		32,

		// tab, empty string, \r, \n
		range(9, 13)		
	]);

var isBlacklistedIndex = function(blacklist, index) {
	if (!blacklist.length) { return false; }

	var idx = blacklist.indexOf(index);
	if (idx === -1) { return false; }

	blacklist.splice(idx, 1);
	return true;
};

var chars = function() {
	var bl = blacklist.slice();
		startChecking = blacklist.reduce(function(base, num) {
			return Math.max(base, num);
		}, 0);

	var arr = new Array(ITERATIONS - blacklist.length),
		count = 0,
		idx = ITERATIONS;
	while (idx--) {
		// this speeds things up significantly
		if (idx <= startChecking) {
			if (isBlacklistedIndex(bl, idx)) { continue; }
		}
		arr[count] = String.fromCharCode(idx);
		count++;
	}
	return arr;
};

// this is faster as a separate method
// rather than being included in the chars
// generation above
var mapTokens = function(tokens) {
	var map = {},
		inverse = {},
		idx = 0, length = tokens.length;
	for (; idx < length; idx++) {
		map[tokens[idx]] = idx;
		inverse[idx] = tokens[idx];
	}
	return {
		map: map,
		inverse: inverse
	};
};

var tokens = chars(),
	result = mapTokens(tokens);

module.exports = {
	/* debug: start */
	generate: chars,
	/* debug: end */

	tokens:   tokens,
	numMap:   result.map,
	valueMap: result.inverse,
	maxValue: tokens.length
};