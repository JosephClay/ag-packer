var ITERATIONS = 65536,

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

	var obj = {},
		count = 0,
		idx = ITERATIONS;
	while (idx--) {
		// this speeds things up significantly
		if (idx <= startChecking) {
			if (isBlacklistedIndex(bl, idx)) { continue; }
		}
		obj[idx] = String.fromCharCode(idx);
	}
	return obj;
};

var nonUnique = [];
var isValueUnique = function(obj, theValue, theKey) {
	for (var key in obj) {
		if (key === theKey) { continue; }
		if (obj[key] === theValue) { return false; }
	}
	return true;
};
var uniq = function(obj) {
	for (var key in obj) {
		if (!isValueUnique(obj, obj[key], key)) {
			nonUnique.push(key);
			delete obj[key];
		}
	}
	return obj;
};

var _      = require('lodash'),
	fs     = require('fs'),
	tokens = require('../src/tokens');

fs.writeFileSync('./temp/tokens.txt', JSON.stringify(chars()));

var tokenFile      = fs.readFileSync('./temp/tokens.txt').toString(),
	fileChars      = JSON.parse(tokenFile),
	unqueFileChars = uniq(JSON.parse(tokenFile));

fs.writeFileSync('./temp/unqiue.txt', JSON.stringify(nonUnique));