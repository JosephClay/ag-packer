var tokens = require('./src/tokens'),
	fs     = require('fs');

fs.writeFile('./data/tokens.txt', tokens.generate().join(''), function(err) {
	if (err) { throw err; }

	console.log('done');
});