/**
 * qslist -- singly-linked fifo list
 *
 * 2016-04-23 - AR.
 */

module.exports = Slist;

function Slist( ) {
}

Slist.prototype = {
    _head: null,
    _tail: null,

    create: function create( ) {
        return new Slist();
    },

    append: function append( item ) {
        item._next = null;
        if (!this._head) { this._tail = this._head = item; }
        else { this._tail._next = item; this._tail = item; }
    },

    push: null,

    shift: function shift( ) {
        var item = this._head;
        if (!item) return null;
        if (item._next) this._head = item._next;
        else this._tail = this._head = null;
        return item;
    },

    isEmpty: function isEmpty( ) {
        return !this._head;
    },

    peek: function peek( ) {
        return this._head;
    },
}

Slist.prototype.push = Slist.prototype.append;
