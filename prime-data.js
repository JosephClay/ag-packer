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

    sampleDataJson = fs.readFileSync('./tests/data/sample-data-raw.json').toString(),
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
	writeData('./tests/data/tiny-data.json', tinyDataJson),
	writeData('./tests/data/small-data.json', smallDataJson),
	writeData('./tests/data/medium-data.json', mediumDataJson),
	writeData('./tests/data/big-data.json', bigDataJson),
	writeData('./tests/data/sample-data.json', sampleDataJson),

	packAndWriteData('./tests/data/tiny-data-packed.txt', tinyData),
	packAndWriteData('./tests/data/small-data-packed.txt', smallData),
	packAndWriteData('./tests/data/medium-data-packed.txt', mediumData),
	packAndWriteData('./tests/data/big-data-packed.txt', bigData),
	packAndWriteData('./tests/data/sample-data-packed.txt', sampleData)
])
.then(function() {
	console.log('done');
})
.catch(function(err) {
	console.error(err);
});