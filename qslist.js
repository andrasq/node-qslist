/**
 * qslist -- quick singly-linked list
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

// aliases
commands.enqueue = commands.push;
commands.dequeue = commands.shift;
commands.append = commands.push;
commands.prepend = commands.unshift;

commands.SList.prototype = {
    push: function push(item) { commands.push(this.list, {x:item, next:0}) },
    unshift: function unshift(item) { commands.unshift(this.list, {x:item, next:0}) },
    shift: function shift() { return this.list.head ? commands.shift(this.list).x : undefined },
    isEmpty: function isEmpty() { return !this.list.head },
    peek: function peek() { return this.list.head },
    getLength: function getLength() { return this.list.length },
    append: function append(item) { this.push(item) },
    prepend: function prepend(item) { this.unshift(item) },
    enqueue: function enqueue(item) { this.push(item) },
    dequeue: function dequeue() { return this.shift() },
}

module.exports = commands;

})(module || window);
