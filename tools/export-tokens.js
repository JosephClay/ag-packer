var tokens = require('../src/tokens'),
	fs     = require('fs'),
    path   = require('path');

fs.writeFile(path.resolve(__dirname, '../data/tokens.txt'), tokens.generate().join(''), function(err) {
	if (err) { throw err; }

	console.log('done');
});