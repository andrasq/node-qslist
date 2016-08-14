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

### q.push( item )

Add the item to the end of the list.

### q.shift( )

Remove and return the first item at the front of the list.

### q.unshift( item )

Add the item to the front of the list.

### q.isEmpty( )

Test whether the list is empty.

### q.peek( )

Return the item at the front of the list, but do not remove it.
Returns null if the list is empty.

### q.length

The `length` property is set to the number of items on the list.
Do not modify this field.


Engine
------

Qslist internally is a function library that operates on an external linked list.

### qslist.create( )

Factory that returns an empty linked list with with fields head, tail and length.

### qslist.push( list, obj )

Append the object to the end of the list.  The object's `next` property will be
used for linkage.

### qslist.shift( list )

Remove and return the first object at the front of the list.  The `next` field of
the object is not cleared, and may contain unspecified data.

### qslist.unshift( list, obj )

Prepend the object to the front of the list.

### qslist.isEmpty( list )

Test whether the list contains no objects.

### qslist.peek( )

Return the first object at the front of the list, but without removing the object.


Todo
----

- rename head/tail/length to _head/_tail/_length to piggy-back better
- rename next field to _next

Related work
------------

- [fast-list]() - fast doubly-linked list
- [qlist]() - very fast list implemented in a circular buffer
- [quickq]() - the project that generated this package
