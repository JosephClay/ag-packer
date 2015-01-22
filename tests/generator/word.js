var _ = require('lodash'),
	
	CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
	MIN = 0, MAX = CHARS.length;

module.exports = {
	random: function(min, max) {
		min = min === undefined ? MIN : min;
		max = max === undefined ? MAX : max;

		return _(CHARS)
			.slice()
			.shuffle()
			.first(_.random(min, max))
			.value()
			.join('');
	},
	fixed: function(len) {
		len = len === undefined ? MAX / 2 : len;
		
		return _(CHARS)
			.slice()
			.shuffle()
			.first(len)
			.value()
			.join('');	
	}
};