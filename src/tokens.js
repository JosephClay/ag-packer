// takes roughly 44ms to generate this data

var ITERATIONS = 65536,
	FINAL_COUNT = 65486,

	// blacklisted char codes
	blacklist = [
		12288, // misc bad characters
		
		8287,
		8239,
		8233,
		8232,
		8202,
		8201,
		8200,
		8199,
		8198,
		8197,
		8196,
		8195,
		8194,
		8193,
		8192,
		6158,
		5760,

		57, // 9
		56, // 8
		55, // 7
		54, // 6
		53, // 5
		52, // 4
		51, // 3
		50, // 2
		49, // 1
		48, // 0
		
		45, // -
		40, // (
		41, // )
		95, // _ underscore = our delimiter

		32, // ' ' blank string
		
		12,  // empty string?
		11,
		133,

		10, // \n
		13, // \r
		
		9, // tab?
		160,

		96,  // numpad 0
		97,  // numpad 1
		98,  // numpad 2
		99,  // numpad 3
		100, // numpad 4
		101, // numpad 5
		102, // numpad 6
		103, // numpad 7
		104, // numpad 8
		105  // numpad 9
	];

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
	maxValue: FINAL_COUNT
};