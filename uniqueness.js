var ITERATIONS = 65536;

var chars = function() {
	var obj = {},
		count = 0,
		idx = ITERATIONS;
	while (idx--) {
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