var co = require('co');

function* anotherGenerator(i) {
    yield 10+i;
    yield 10+i + 2;
    yield 10+i + 3;
}

function *square() {
    yield 1;
    yield* anotherGenerator(1);
    yield 2;
    yield* anotherGenerator(2);
    yield 4;
    yield* anotherGenerator(4);
    yield 9;
}

var squares = square(); // generator
function logValues(generator) {
    var v;
    while(!(v = generator.next()).done) {
        console.log('generated value', v.value);
    }
}

var promiseCount = 0;

logValues(squares);
