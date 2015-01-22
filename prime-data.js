var Promise      = require('bluebird'),
    packer       = require('./index'),
	fs           = require('fs'),

	tinyDataGen    = require('./tests/tiny-data'),
	tinyData       = tinyDataGen(),
	tinyDataJson   = JSON.stringify(tinyData),

	smallDataGen   = require('./tests/small-data'),
    smallData      = smallDataGen(),
    smallDataJson  = JSON.stringify(smallData),

	mediumDataGen  = require('./tests/medium-data'),
    mediumData     = mediumDataGen(),
    mediumDataJson = JSON.stringify(mediumData),

	bigDataGen     = require('./tests/big-data'),
    bigData        = bigDataGen(),
    bigDataJson    = JSON.stringify(bigData),

    sampleDataJson = fs.readFileSync('./sample-data-raw.json').toString(),
	sampleData     = JSON.parse(sampleDataJson);

var writeData = function(p, data) {
	return new Promise(function(resolve, reject) {
		fs.writeFile(p, data, 'utf8', function(err) {
			if (err) { throw err; }

			console.log('done: ', p);
			resolve();
		});
	});
};

var packAndWriteData = function(p, data) {
	return writeData(p, packer.pack(data));
};

Promise.all([
	writeData('./data/tiny-data.json', tinyDataJson),
	writeData('./data/small-data.json', smallDataJson),
	writeData('./data/medium-data.json', mediumDataJson),
	writeData('./data/big-data.json', bigDataJson),
	writeData('./data/sample-data.json', sampleDataJson),

	packAndWriteData('./data/tiny-data-packed.txt', tinyData),
	packAndWriteData('./data/small-data-packed.txt', smallData),
	packAndWriteData('./data/medium-data-packed.txt', mediumData),
	packAndWriteData('./data/big-data-packed.txt', bigData),
	packAndWriteData('./data/sample-data-packed.txt', sampleData)
])
.then(function() {
	console.log('done');
})
.catch(function(err) {
	console.error(err);
});