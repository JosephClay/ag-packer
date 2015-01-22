var _    = require('lodash'),
	fs   = require('fs'),
	pack = require('../src/pack'),
	unpack = require('../src/unpack'),
	json = JSON.parse(fs.readFileSync('./data/sample-data.json').toString());

var occurances = function(data) {
	return _.reduce(data, function(log, node) {

		_.each(node, function(value, key) {
			log[value] = log[value] || 0;
			log[value]++;
		});

		return log;

	}, {});
};

var occurancesByKey = function(data) {
	return _.reduce(data, function(order, node, idx) {

		_.each(node, function(value, key) {
			order[key] = order[key] || {};
			order[key][value] = order[key][value] || 0;
			order[key][value]++;
		});

		return order;

	}, {});
};

var splitKeyStreaks = function(data) {
	var streaks = _(_.first(data))
		.keys()
		.reduce(function(s, key) {
			s[key] = [];
			return s;
		}, {});

	return _.reduce(data, function(s, node, idx) {

		_.each(node, function(value, key) {
			s[key].push(value);
		});

		return s;

	}, streaks);
};

/*
fs.writeFileSync('./temp/new-pack.txt', pack.pack(json));
fs.writeFileSync('./temp/new-pack.json', 
	JSON.stringify(
		unpack.unpack(fs.readFileSync('./temp/new-pack.txt').toString())
	)
);
*/
fs.writeFileSync('./temp/tiny-data-unpacked.json', 
	JSON.stringify(
		unpack.unpack(fs.readFileSync('./data/tiny-data-packed.txt').toString())
	)
);