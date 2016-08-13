/**
 * quick singly-linked list
 *
 * Copyright (C) 2016 Andras Radics
 * Licensed under the Apache License, Version 2.0
 *
 * 2016-08-09 - AR.
 */

;(function(module){  // closure for web browsers

'use strict';

var commands = {
    create: function create( ) {
        return { head: null, tail: null, length: 0 };
    },

    push: function push( q, item ) {
        if (!q.tail) {
            q.head = q.tail = item;
            q.length = 1;
            item.next = null;
        }
        else {
            q.tail.next = item;
            q.tail = item;
            q.length += 1;
            item.next = null;
        }
    },

    unshift: function unshift( q, item ) {
        if (!q.head) {
            q.head = q.tail = item;
            q.length = 1;
            item.next = null;
        }
        else {
            item.next = q.head;
            q.head = item;
            q.length += 1;
        }
    },

    shift: function shift( q ) {
        var item = q.head;
        if (item) {
            if (item.next) q.head = item.next;
            else q.head = q.tail = null;
            q.length -= 1;
        }
        return item;
    },

    isEmpty: function isEmpty( q ) {
        return !q.head;
    },

    peek: function peek( q ) {
        return q.head;
    },

    SList: function SList( ) {
        this.list = commands.create();
        // `this.list` and prototype is 5% faster than acting on `this` directly
    },
}

commands.SList.prototype = {
    push: function push(item) { commands.push(this.list, {x:item, next:0}) },
    unshift: function unshift(item) { commands.unshift(this.list, {x:item, next:0}) },
    shift: function shift() { return this.list.head ? commands.shift(this.list).x : undefined },
    isEmpty: function isEmpty() { return !this.list.head },
    peek: function peek() { return this.list.head },
    getLength: function getLength() { return this.list.length },
}

module.exports = commands;


// self-test:
///**

var assert = require('assert');
var timeit = require('qtimeit');
var qlist = require('qlist');

var qslist = module.exports;
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
})(module || window);
