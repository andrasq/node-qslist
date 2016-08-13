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


Api
---

## q.push( item )

## q.shift( )

## q.unshift( item )

## q.isEmpty( )

## q.peek( )

## q.length


Related work
------------

- [fast-list]() - fast doubly-linked list
- [qlist]() - very fast list implemented in a circular buffer
- [quickq]() - the project that generated this package
