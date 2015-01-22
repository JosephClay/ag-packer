var generator = require('./generator'),
    g         = generator,
    objGen    = generator.compose()
        .key(g.word.fixed(9)).value(g.num.fixed(1))
        .key(g.word.fixed(7)).value(g.count.up(1))
        .key(g.word.fixed(5)).value(g.num.random(1, 9))
        .key(g.word.fixed(3)).value(g.set(g.num.random(0, 9), 10))
        .key(g.word.fixed(1)).value(g.set(g.num.random(0, 9), 5));
        
module.exports = generator(objGen, 5);