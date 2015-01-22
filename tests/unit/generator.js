var _         = require('lodash'),
	generator = require('../generator'),
	g         = generator;

module.exports = {

	generate: function(test) {
		test.expect(11);

		var iterations = 1440,
			sets = 250,
			obj = generator.compose()
				.key(g.word.fixed(20)).value(g.num.fixed(6))
				.key(g.word.fixed(20)).value(g.count.up(1))
				.key(g.word.fixed(20)).value(g.num.random(1, 1e6))
				.key(g.word.fixed(20)).value(g.set(g.num.random(6), 10))
				.key(g.word.fixed(20)).value(g.set(g.num.random(6), 5));

		test.ok(!!obj, 'did not compose obj');
		test.ok(_.isFunction(obj), 'composed obj is not a function');

		var datagen = generator(obj, iterations);
		
		test.ok(!!datagen, 'did not create datagen');
		test.ok(_.isFunction(datagen), 'created datagen is not a function');

		var data = datagen();
		test.ok(!!datagen, 'did not create data');
		test.ok(_.isArray(data), 'data is not an array');
		test.ok(data.length === iterations, 'data is not populated');
		
		var jsonData = datagen.toJSON(datagen);
		test.ok(!!jsonData, 'no json data created');
		test.ok(_.isString(jsonData), 'json data is not a string');
		test.ok(JSON.parse(jsonData).length === iterations, 'json data does not parse into correct data');
		
		var datagen2 = generator(obj, iterations, sets);
		test.ok(datagen2().length === (iterations * sets), 'json data does not have correct number of items');

		test.done();
	}
};