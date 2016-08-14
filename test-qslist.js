/**
 * qslist -- quick singly-linked list
 *
 * Copyright (C) 2016 Andras Radics
 * Licensed under the Apache License, Version 2.0
 */

// self-test:

var assert = require('assert');
var timeit = require('qtimeit');
var qlist = require('qlist');

var qslist = require('./');
var a = {a:1}, b = {b:1}, c = {c:1}, d = {d:1};

var q = qslist.create();
assert(qslist.isEmpty(q));
assert(q.head === undefined && q.tail === undefined);

// peek
qslist.push(q, a);
assert(qslist.peek(q) === a);
qslist.shift(q);
assert(qslist.peek(q) === undefined);

// linkage on push
var q = qslist.create();
assert(q.length === 0);
qslist.push(q, a);
assert(q.length === 1);
assert(!qslist.isEmpty(q));
assert(a._next === undefined);
assert(q.head === a && q.tail === a);
qslist.push(q, b);
assert(q.length === 2);
assert(!qslist.isEmpty(q));
assert(a._next === b && b._next === undefined);
assert(q.head === a && q.tail === b);
qslist.push(q, c);
assert(q.length === 3);
assert(!qslist.isEmpty(q));
assert(a._next === b && b._next === c && c._next === undefined);
assert(q.head === a && q.tail === c);
qslist.push(q, d);
assert(q.length === 4);
assert(!qslist.isEmpty(q));
assert(a._next === b && b._next === c && c._next === d && d._next === undefined);
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
assert(q.head === undefined && q.tail === undefined);
assert(qslist.isEmpty(q));
assert(qslist.shift(q) === undefined);
assert(q.length === 0);

// linkage on unshift
qslist.unshift(q, a);
assert(!qslist.isEmpty(q));
assert(q.length === 1);
assert(q.head === a && q.tail === a);
assert(a._next === undefined);
qslist.unshift(q, b);
assert(q.length === 2);
assert(q.head === b && q.tail === a);
assert(b._next === a && a._next === undefined);

