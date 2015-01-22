var _          = require('lodash'),
	characters = 'abcdefghijklmnopqrstuvwxyz'.split('');

// { foo: 12345 } => { foo: 'a' }
var remap = function(base) {
	return _(base)
		.keys()
		.reduce(function(obj, key, idx) {
			obj[key] = characters[idx];
			return obj;
		}, {})
		.value();
};

var remapper = function(remap) {
	return function(clone, key) {
		clone[remap[key]] = base[key];
		return clone;
	};
};

// { foo: 12345 } => { a: 12345 }
var cloner = function(remap) {
	return function(base) {
		return _(base)
			.keys()
			.reduce(remap, {})
			.value();
	};
};

module.exports = function(data) {
	var map = remap(_.first(data)),
		clone = cloner(remapper(map));

	return _.reduce(data, function(set, obj) {
		set.push(clone(obj));
		return set;
	}, []);
};