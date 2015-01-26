var _      = require('lodash'),
	fs     = require('fs'),
	tokens = require('../src/tokens');

var chars1 = tokens.generate(),
	chars2 = _.uniq(tokens.generate()),
	areTheSame = chars1.join('') === chars2.join('');

console.log('chars1 count: ', chars1.length);
console.log('chars2 count: ', chars2.length);
console.log('chars1 is same as chars2: ', areTheSame);

var tokenFile                 = fs.readFileSync('./data/tokens.txt').toString(),
	tokenFileTokens           = tokenFile.split(''),
	tokenFileUniqTokens       = _.uniq(tokenFileTokens.slice()),
	areTokenFileTokensTheSame = tokenFileTokens.join('') === tokenFileUniqTokens.join('');

console.log('token file tokens count: ', tokenFileTokens.length);
console.log('token file tokens unique count: ', tokenFileUniqTokens.length);
console.log('token file is same as token file unique: ', areTokenFileTokensTheSame);
