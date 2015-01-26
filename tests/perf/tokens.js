var tokens       = require('../../src/tokens'),
	processClock = require('process-clock'),
    table        = [];

module.exports = {
    load: function(test) {
        test.expect(1);

        var clock = processClock();
		tokens.generate();

    	clock.end();

	    table.push({
	        name:     'token generation',
	        time:     clock.humanize()
	    });

        console.table(table);
        test.ok(true, 'ran the test');
        test.done();
    }
};