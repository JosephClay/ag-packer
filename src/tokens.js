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
	])
	// sort highest to lowest as that's the order
	// we're looping though indicies
	.sort(function(a, b){ return b - a; }),

	MAX_BLACKLISTED_INDEX = blacklist.reduce(function(base, num) {
		return Math.max(base, num);
	}, 0);

var isBlacklistedIndex = function(blacklist, index) {
	if (blacklist[0] !== index) { return false; }

	blacklist.shift();

	return true;
};

var chars = function() {
	
	var bl    = blacklist.slice(),
		map   = {},
		idx   = ITERATIONS,
		count = 0,
		str;

	while (idx--) {
		// this speeds things up significantly
		if (idx <= MAX_BLACKLISTED_INDEX && isBlacklistedIndex(bl, idx)) {
			continue;
		}
		
		str = String.fromCharCode(idx);
		
		map[count] = str;
		map[str] = count;

		count++;
	}

	map.size = count;

	return map;
};

var tokens = module.exports = chars();
tokens.generate = chars;