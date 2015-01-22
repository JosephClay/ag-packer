var tokens = require('./src/tokens'),
	fs     = require('fs');

fs.writeFile('./tests/data/tokens.txt', tokens.generate().join(''), function(err) {
	if (err) { throw err; }

	console.log('done');
});