var _    = require('lodash'),
	fs   = require('fs'),
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

var flatten = function(data) {
	return _.reduce(data, function(log, node) {

		_.each(node, function(value, key) {
			log.push(value);
		});

		return log;

	}, []);
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
