var _ = require('lodash'),
	
	CHARS = '123456789123456789123456789123456789123456789123456789123456789123456789'.split('');

module.exports = {
	random: function(min, max) {
		return _.random(min, max);
	},
	fixed: function(len) {
		return +(
			_(CHARS)
				.slice()
				.shuffle()
				.first(len)
				.value()
				.join('')
		);
	}
};