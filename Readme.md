qslist
======

Quick singly-linked list.


Overview
--------

        var List = require('qslist').SList;
        var q = new List();

        q.push(1);
        var x = q.shift();
        // => 1


Class Api
---------

## q.push( item )

## q.shift( )

## q.unshift( item )

## q.isEmpty( )

## q.peek( )

## q.length


Engine
------

Qslist internally is a function library that operates on an external linked list.

## qslist.create( )

Factory that returns an empty linked list with with fields head, tail and length.

## qslist.push( list, item )

## qslist.shift( list )

## qslist.unshift( list, item )

## qslist.isEmpty( list )

## qslist.peek( )


Todo
----

- rename head/tail/length to _head/_tail/_length to piggy-back better
- rename next field to _next

Related work
------------

- [fast-list]() - fast doubly-linked list
- [qlist]() - very fast list implemented in a circular buffer
- [quickq]() - the project that generated this package
