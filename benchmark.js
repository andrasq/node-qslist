/**
 * qslist -- quick singly-linked list
 *
 * Copyright (C) 2016 Andras Radics
 * Licensed under the Apache License, Version 2.0
 */

var timeit = require('qtimeit');
var qslist = require('./');

var x, nloops = 100000;
// NOTE: why huge diff in speed between 100 and 200 items??

if (0) {
console.log("AR: qslist");
var x;
var q = qslist.create();
timeit(nloops, function(){ qslist.push(q, {_next: null}) });
// 12m/s 100k, 9.1m/s 1m, 6m/s 100, 2.8m/s 1k, 8.5m/s 10k (25m/s 100k on rerun with all objects on free list)
timeit(nloops, function(){ x = qslist.shift(q) });
// 20-22m/s 100k, 39m/s 1m (28m/s on rerun once all objects on free list)
}

if (0) {
console.log("AR: qslist");
var x;
var q = qslist.create();
timeit(nloops, function(){ qslist.push(q, {_next: null}) });
timeit(nloops, function(){ x = qslist.shift(q) });
}

if (0) {
console.log("AR: SList");
var q = new qslist.SList();
timeit(nloops, function(){ q.push({_next: null}) });
// 11-12m/s 100k (25m/s 100k on rerun when all objs on free list)
timeit(nloops, function(){ x = q.shift() });
// 21-22m/s 100k (26-28m/s 100k on rerun when objs on free list)
}

if (0) {
console.log("AR: SList");
var q = new qslist.SList();
timeit(nloops, function(){ q.push({_next: null}) });
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
timeit(nloops, function(){ q.push({_next: null}) });
// 24m/s 100k, 15m/s 1m
timeit(nloops, function(){ x = q.shift() });
// 37.8m/s 100k, 109.5m/s 1m, 9.8m/s 100
timeit(nloops, function(){ q.push(null) });
// into used queue: 111m/s 100k, 81m/s-160m/s 1m
}



var SList = require('./').SList;
L = new SList();

var FastList = require('fast-list');
DL = new FastList();

// pre-allocate heap and exercise the list to optimize the methods
// with: 42m/s, w/o: 17m/s (10m items)
//for (var i=0; i<1000000; i++) L.append({});
//while (L.shift()) ;

var t1, t2, x;

if (1) {

for (var loopI=0; loopI<3; loopI++) {
console.log("fast-list");
timeit(100000, function(){ x = new FastList() });
// 30m/s
timeit(1000000, function(){ DL.push(1) });
// 4m/s (only!?) 20m, 7m/s 1m
timeit(1000000, function(){ x = DL.shift(1) });
// 20m: 35m/s without heap prealloc, 90m/s with heap prealloc, 1m: 26m/s without, 78m/s with prealloc
timeit(10000, function(){ for (var i=0; i<100; i++) { DL.push(1); x = DL.shift() } });
// 1k ripple: 8.5m/s, 100 ripple: 8.5m/s (but once it spiked to 22.7m/s ?!)
// note: very sensitive to heap state!

console.log("qslist");
timeit(100000, function(){ x = new SList() });
// 20m: 17m/s; 1m: 22m/s after DL with prealloc, 3.4m/s without prealloc
timeit(1000000, function(){ L.push(1) });
// 20m: 20m/s, 1m: 33m/s with prealloc (or rerun), 11m/s without prealloc
timeit(1000000, function(){ x = L.shift(1) });
// 20m: 40m/s, 60m/s after DL test; 1m after DL: 42m/s with prealloc (or on rerun), 32m/s without
timeit(10000, function(){ for (var i=0; i<100; i++) { L.push(1); x = L.shift() } });
// 1k ripple: 22.5m/s, 100 ripple: 22m/s
}

}

var L2 = qslist.create();

t1 = Date.now();
for (var i=1; i<=10000000; i++) qslist.enqueue(L2, {a: i, _next: 0});
t2 = Date.now();
console.log("qslist.enqueue 1m in %d ms", t2 - t1);
// 6.2.2: 14m/s

t1 = Date.now();
while (x = qslist.dequeue(L2)) ;
t2 = Date.now();
console.log("qslist.dequeue 1m in %d ms", t2 - t1);
// 6.2.2: 35m/s

t1 = Date.now();
for (var i=0; i<1000000; i++) L.append({a: i, _next: undefined});
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
