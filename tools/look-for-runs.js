var _       = require('lodash'),
	fs      = require('fs'),
	rawData = fs.readFileSync('./data/sample-data-packed.txt').toString(),
	data    = rawData.split('\n')[2].split(''),
	runs    = {};

var lookForRun = function(cha, chaArr) {
	var idx = 0, length = chaArr.length,
		highestRun = 0,
		currentRun = 0,
		prevCha;
	for (; idx < length; idx++) {
		if (prevCha === undefined) {
			prevCha = chaArr[idx];
			continue;
		}

		var c = chaArr[idx];
		if (c === cha) {
			currentRun++;
		} else {
			// run is over
			highestRun = Math.max(highestRun, currentRun);
			currentRun = 0;
		}

		prevCha = c;
	}

	return highestRun;
};

var count = 0;
var result = _(data.slice())
	.uniq()
	.tap(function(arr) {
		console.log('num of unique chars', arr.length);
		return arr;
	})
	.reduce(function(runs, cha) {
		var run = lookForRun(cha, data);
		if (run > 2) { runs[cha] = run; }
	
		return runs;
	}, {});

console.log('result: ', result);