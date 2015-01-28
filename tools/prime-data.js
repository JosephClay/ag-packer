var Promise      = require('bluebird'),
    packer       = require('../index'),
    path         = require('path'),
	fs           = require('fs'),

    tinyDataGen    = require('../tests/tiny-data'),
    tinyData       = tinyDataGen(),
    tinyDataJson   = JSON.stringify(tinyData),

    smallDataGen   = require('../tests/small-data'),
    smallData      = smallDataGen(),
    smallDataJson  = JSON.stringify(smallData),

    mediumDataGen  = require('../tests/medium-data'),
    mediumData     = mediumDataGen(),
    mediumDataJson = JSON.stringify(mediumData),

    bigDataGen     = require('../tests/big-data'),
    bigData        = bigDataGen(),
    bigDataJson    = JSON.stringify(bigData),

    sampleDataJson = fs.readFileSync(path.resolve(__dirname, '../data/sample-data-raw.json')).toString(),
    sampleData     = JSON.parse(sampleDataJson),

    sampleData2Json = fs.readFileSync(path.resolve(__dirname, '../data/sample-data-raw-2.json')).toString(),
    sampleData2     = JSON.parse(sampleData2Json);


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
	writeData(path.resolve(__dirname, '../data/tiny-data.json'), tinyDataJson),
	writeData(path.resolve(__dirname, '../data/small-data.json'), smallDataJson),
	writeData(path.resolve(__dirname, '../data/medium-data.json'), mediumDataJson),
	// writeData(path.resolve(__dirname, '../data/big-data.json'), bigDataJson),
	writeData(path.resolve(__dirname, '../data/sample-data.json'), sampleDataJson),
	writeData(path.resolve(__dirname, '../data/sample-data-2.json'), sampleData2Json),

	packAndWriteData(path.resolve(__dirname, '../data/tiny-data-packed.txt'), tinyData),
	packAndWriteData(path.resolve(__dirname, '../data/small-data-packed.txt'), smallData),
	packAndWriteData(path.resolve(__dirname, '../data/medium-data-packed.txt'), mediumData),
	// packAndWriteData(path.resolve(__dirname, '../data/big-data-packed.txt'), bigData),
	packAndWriteData(path.resolve(__dirname, '../data/sample-data-packed.txt'), sampleData),
	packAndWriteData(path.resolve(__dirname, '../data/sample-data-2-packed.txt'), sampleData2)
])
.then(function() {
	console.log('done');
})
.catch(function(err) {
	console.error(err);
});