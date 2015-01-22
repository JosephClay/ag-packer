var _ = require('lodash');

module.exports = function() {

	var steps = [];

	var create = function(stepIndex) {
		var obj = {},
			idx = 0, length = steps.length,
			step;
		for (; idx < length; idx++) {
			step = steps[idx];
			obj[step[0](stepIndex)] = step[1](stepIndex);
		}
		return obj;
	};

	return _.extend(create, {
		key: function(keyFn) {
			return {
				value: function(valFn) {
					steps.push([keyFn, valFn]);
					return create;
				}
			};
		}
	});
};