var slice = ([]).slice;

module.exports = {
	isDigit: function(cha) {
	    return cha === '1' ||
	           cha === '2' ||
	           cha === '3' ||
	           cha === '4' ||
	           cha === '5' ||
	           cha === '6' ||
	           cha === '7' ||
	           cha === '8' ||
	           cha === '9' ||
	           cha === '0';
	},

	fastmap: function(array, iterator) {
		var idx = 0, length = array.length;
		for (; idx < length; idx++) {
			array[idx] = iterator(array[idx], idx);
		}
		return array;
	}
};