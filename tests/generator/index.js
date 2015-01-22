var _ = require('lodash'),
	word = require('./word'),
	num = require('./num'),
	composer = require('./composer');

var generator = function(comp, len, sets) {
	len = len || 1;
	sets = sets || 1;

	var gen = function() {
		var arr = new Array(len * sets),
			index = 0,
			count = 0;
		for (var idx = 0; idx < len; idx++) {
			for (var i = 0; i < sets; i++) {
				arr[index] = comp(count);
				index++;
			}
			count++;
		}
		return arr;
	};
	return _.extend(gen, {
		toJSON: function() {
			return JSON.stringify(gen());
		}
	});
};

module.exports = _.extend(generator, {
	compose: composer,

	word: {
		fixed: function(start, end) {
			start = start || 0;
			var value = !end ? word.fixed(start) : word.random(start, end);
			return function() {
				return value;
			};
		},
		random: function(start, end) {
			start = start || 0;
			var method = !end ? word.fixed : word.random;
			return function() {
				return method(start, end);
			};
		}
	},

	set: function(fn, len) {
		var set = new Array(len),
			idx = len;
		while (idx--) {
			set[idx] = fn();
		}

		var maxIndex = len - 1;
		return function() {
			var index = _.random(0, maxIndex);
			return set[index];
		};
	},

	count: {
		up: function(start) {
			var idx = start || 0,
				prevIndex;
			return function(stepIndex) {
				var val = idx;
				if (prevIndex !== stepIndex) {
					prevIndex = stepIndex;
					idx++;
				}
				return val;
			};
		},
		down: function(start) {
			var idx = start || 0,
				prevIndex;
			return function(stepIndex) {
				var val = idx;
				if (prevIndex !== stepIndex) {
					prevIndex = stepIndex;
					idx--;
				}
				return val;
			};
		}
	},

	num: {
		fixed: function(start) {
			start = start || 0;
			var value = num.fixed(start);
			return function() {
				return value;
			};
		},
		random: function(start, end) {
			start = start || 0;
			var method = !end ? num.fixed : num.random;
			return function() {
				return method(start, end);
			};
		}
	}
});