/**
 * qslist -- singly-linked fifo list
 */

Slist = require('./');
L = new Slist();

/**

assert = require('assert');

assert(L._head == null);
assert(L._tail == null);
assert(L.isEmpty());

L.append({a: 1});
assert(L._head == L._tail);
assert(L._head._next == null);
assert.equal(L._head.a, 1);
assert(!L.isEmpty());

L.append({a: 2});
assert(L._head != L._tail);
assert(L._head.a == 1);
assert(L._tail.a == 2);
assert(L._head._next == L._tail);

L.append({a: 3});
assert(L._head.a == 1);
assert(L._tail.a == 3);
assert(L._tail._next == null);

L.shift();
assert(L._head.a == 2);
assert(L._tail.a == 3);

L.shift();
assert(L._head.a == 3);
assert(L._tail.a == 3);

L.shift();
assert(L.isEmpty());
assert.strictEqual(L.shift(), null);
assert.strictEqual(L.shift(), null);

/**/

// pre-allocate heap and exercise the list to optimize the methods
for (var i=0; i<1000000; i++) L.append({});
while (L.shift()) ;

var t1, t2, x;

t1 = Date.now();
for (var i=0; i<1000000; i++) L.append({a: i, _next: null});
t2 = Date.now();
console.log("appended 1m in %d ms", t2 - t1);
// 100k: v0.10.52: 7m/s, v5.10.1: 4m/s
// 1m: v0.10.42: 3m/s if not, 6m/s if yes _next, v5.10.1: 9m/s if yes _next, 4m/s if not
// 1m: v5.10.1: 22m/s if compiled, pre-allocated with _next (44ms)
// 10m: v5.10: 40-45m/s if comp/alloc/_next (5m/s v0.10)

t1 = Date.now();
while (x = L.shift()) ;
t2 = Date.now();
console.log("got 1m in %d ms", t2 - t1);
// 1m: v0.10.42: 50m/s if pre-declared _next, 40m/s if not; v5.10.1: 67m/s if pre-declared _next, 76m/s if not
// 1m: v5.10.1: 83-90m/s if compiled, pre-allocated with _next (11ms, 12ms)
// 10m: v5.10: 75-96m/s (60m/s v0.10)

function fptime() {
    var tm = process.hrtime();
    return tm[0] + tm[1] * 1e-9;
}
t1 = Date.now();
for (var i=0; i<1000000; i++) { L.append({_next: 1}); L.shift() }
t2 = Date.now();
console.log("rippled 1m in %d ms", t2 - t1);
// v5.10: 1m: 14m/s, 4m: 27m/s, 10m: v5.10: 23m/s, 40m: 37m/s, 100m: 38m/s, 1b: 38m/s
