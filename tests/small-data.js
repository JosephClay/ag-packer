var generator = require('./generator'),
    g         = generator,
    objGen    = generator.compose()
        .key(g.word.fixed(8)).value(g.num.fixed(6))
        .key(g.word.fixed(20)).value(g.count.up(1))
        .key(g.word.fixed(13)).value(g.num.random(1, 1e6))
        .key(g.word.fixed(17)).value(g.set(g.num.random(6), 10))
        .key(g.word.fixed(16)).value(g.set(g.num.random(6), 5));

module.exports = generator(objGen, 100);