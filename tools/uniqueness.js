var _      = require('lodash'),
	tokens = require('../src/tokens');

var chars1 = tokens.generate(),
	chars2 = _.uniq(tokens.generate()),
	areTheSame = chars1.join('') === chars2.join('');

console.log('chars1 count: ', chars1.length);
console.log('chars2 count: ', chars2.length);
console.log('chars1 is same as chars2: ', areTheSame);