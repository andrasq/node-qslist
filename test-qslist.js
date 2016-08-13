/**
 * qslist -- quick singly-linked list
 *
 * Copyright (C) 2016 Andras Radics
 * Licensed under the Apache License, Version 2.0
 */

// self-test:
///**

var assert = require('assert');
var timeit = require('qtimeit');
var qlist = require('qlist');

var qslist = require('./qslist');
var a = {a:1}, b = {b:1}, c = {c:1}, d = {d:1};

var q = qslist.create();
assert(qslist.isEmpty(q));
assert(q.head === null && q.tail === null);

// peek
qslist.push(q, a);
assert(qslist.peek(q) === a);
qslist.shift(q);
assert(qslist.peek(q) === null);

// linkage on push
var q = qslist.create();
assert(q.length === 0);
qslist.push(q, a);
assert(q.length === 1);
assert(!qslist.isEmpty(q));
assert(a.next === null);
assert(q.head === a && q.tail === a);
qslist.push(q, b);
assert(q.length === 2);
assert(!qslist.isEmpty(q));
assert(a.next === b && b.next === null);
assert(q.head === a && q.tail === b);
qslist.push(q, c);
assert(q.length === 3);
assert(!qslist.isEmpty(q));
assert(a.next === b && b.next === c && c.next === null);
assert(q.head === a && q.tail === c);
qslist.push(q, d);
assert(q.length === 4);
assert(!qslist.isEmpty(q));
assert(a.next === b && b.next === c && c.next === d && d.next === null);
assert(q.head === a && q.tail === d);

// linkage on shift
assert(qslist.shift(q) === a);
assert(q.length === 3);
assert(q.head === b && q.tail === d);
assert(qslist.shift(q) === b);
assert(q.length === 2);
assert(q.head === c && q.tail === d);
assert(qslist.shift(q) === c);
assert(q.length === 1);
assert(q.head === d && q.tail === d);
assert(qslist.shift(q) === d);
assert(q.length === 0);
assert(q.head === null && q.tail === null);
assert(qslist.isEmpty(q));
assert(qslist.shift(q) === null);
assert(q.length === 0);

// linkage on unshift
qslist.unshift(q, a);
assert(!qslist.isEmpty(q));
assert(q.length === 1);
assert(q.head === a && q.tail === a);
assert(a.next === null);
qslist.unshift(q, b);
assert(q.length === 2);
assert(q.head === b && q.tail === a);
assert(b.next === a && a.next === null);


// quicktest:
/**

var qslist = module.exports;

var x, nloops = 100000;
// NOTE: why huge diff in speed between 100 and 200 items??

if (0) {
console.log("AR: qslist");
var x;
var q = module.exports.create();
timeit(nloops, function(){ module.exports.push(q, {next: null}) });
// 12m/s 100k, 9.1m/s 1m, 6m/s 100, 2.8m/s 1k, 8.5m/s 10k (25m/s 100k on rerun with all objects on free list)
timeit(nloops, function(){ x = module.exports.shift(q) });
// 20-22m/s 100k, 39m/s 1m (28m/s on rerun once all objects on free list)
}

if (0) {
console.log("AR: qslist");
var x;
var q = module.exports.create();
timeit(nloops, function(){ module.exports.push(q, {next: null}) });
timeit(nloops, function(){ x = module.exports.shift(q) });
}

if (1) {
console.log("AR: SList");
var q = new module.exports.SList();
timeit(nloops, function(){ q.push({next: null}) });
// 11-12m/s 100k (25m/s 100k on rerun when all objs on free list)
timeit(nloops, function(){ x = q.shift() });
// 21-22m/s 100k (26-28m/s 100k on rerun when objs on free list)
}

if (1) {
console.log("AR: SList");
var q = new module.exports.SList();
timeit(nloops, function(){ q.push({next: null}) });
timeit(nloops, function(){ x = q.shift() });
}

if (0) {
console.log("AR: qlist");
// preallocate qlist storage, to measure steady-state speed not mem alloc speed
//var q = new qlist(); for (var i=0; i<nloops; i++) q.push(0); for (var i=0; i<nloops; i++) x = q.pop();
var q = new qlist();
timeit(nloops, function(){ q.push(null) });
// 10k: 16m/s, 5k: 9m/s, 1k: 2.2m/s, 100: 700k/s
// preallocated: 10k 31m/s, 5k 8-16m/s, 1k 4m/s, 100 8.4m/s
// qslist faster below 5k, qlist faster (at times 4x faster) above 5k, but qlist always faster if preallocated
// ie, singly linked list of objects is fast for "short" (thousands, not millions) queues
timeit(nloops, function(){ x = q.shift() });
// qlist is always much faster to dequeue
}

if (0) {
console.log("AR: qlist");
var q = new qlist();
//for (var i=0; i<100; i++) q.push(0); for (var i=0; i<100; i++) x = q.pop();
// faster to push new objects into empty qlist??
timeit(nloops, function(){ q.push({next: null}) });
// 24m/s 100k, 15m/s 1m
timeit(nloops, function(){ x = q.shift() });
// 37.8m/s 100k, 109.5m/s 1m, 9.8m/s 100
timeit(nloops, function(){ q.push(null) });
// into used queue: 111m/s 100k, 81m/s-160m/s 1m
}


/**/

/**
 * qslist -- singly-linked fifo list
 */

Slist = require('./').SList;
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

//qtimeit = require('qtimeit');
//qtimeit.bench.timeGoal = 1.00;
//qtimeit.bench([
//    function(){ for (var i=0; i<1000; i++) L.push(i); for (var i=0; i<1000; i++) x = L.shift(); },
//]);

var L2 = qslist.create();

t1 = Date.now();
for (var i=1; i<=1000000; i++) qslist.enqueue(L2, {a: i, next: 0});
t2 = Date.now();
console.log("qslist.enqueue 1m in %d ms", t2 - t1);
// 6.2.2: 14m/s

t1 = Date.now();
while (x = qslist.dequeue(L2)) ;
t2 = Date.now();
console.log("qslist.dequeue 1m in %d ms", t2 - t1);
// 6.2.2: 35m/s

t1 = Date.now();
for (var i=0; i<1000000; i++) L.append({a: i, next: null});
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
