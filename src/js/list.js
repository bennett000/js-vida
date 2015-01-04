/**
 * file: list.js
 * Created by michael on 01/01/15.
 *
 Vida - Conway inspired life game
 Copyright © 2014 Michael Bennett

 This file is part of Vida.

 Vida is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Vida is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Vida.  If not, see <http://www.gnu.org/licenses/>.
 */
/*global angular*/
angular.module('JSVida-List', [
    'JSVida-ObjectPool'
]).factory('LinkedListNode', [function () {
    'use strict';

    function wrapDelete(deleteFn) {
        /*jshint validthis:true */
        if (!angular.isFunction(deleteFn)) {
            deleteFn = angular.noop;
        }
        var that = this;

        function doDelete() {
            var result = deleteFn();
            that._isDeleted = true;
            that.prev = null;
            that.next = null;
            that.data = null;
            return result;
        }

        this._delete = doDelete;

        return doDelete;
    }

    function recycle(next, prev, data, deleteFn) {
        /*jshint validthis:true */
        this.next = next || null;
        this.prev = prev || null;
        this.data = data;
        this._delete = this.wrapDelete(deleteFn);
        this._isDeleted = false;

        return this;
    }

    /**
     * @param next {LinkedListNode}
     * @param prev {LinkedListNode}
     * @param data {*}
     * @param deleteFn {function(...)}
     * @returns {LinkedListNode}
     * @constructor
     */
    function LinkedListNode(next, prev, data, deleteFn) {
        if (!(this instanceof LinkedListNode)) {
            return new LinkedListNode(next, prev, data, deleteFn);
        }

        this.recycle(next, prev, data, deleteFn);
    }

    LinkedListNode.prototype.recycle = recycle;
    LinkedListNode.prototype.wrapDelete = wrapDelete;

    return LinkedListNode;

}]).factory('LinkedList', ['ObjectPool', 'LinkedListNode', '$log', function (ObjectPool, LinkedListNode, $log) {
    'use strict';
    /** @const */
    var pool = new ObjectPool({
                                  factory: newNode,
                                  recycle: recycleNode
                              });

    /**
     * @param next {LinkedListNode}=
     * @param prev {LinkedListNode}=
     * @param data {*}=
     * @param deleteFn {function(...)}
     * @returns {LinkedListNode}
     */
    function newNode(next, prev, data, deleteFn) {
        return new LinkedListNode(next, prev, data, deleteFn);
    }

    /**
     * @param obj {LinkedListNode}
     * @param next {LinkedListNode}=
     * @param prev {LinkedListNode}=
     * @param data {*}=
     * @param deleteFn {function(...)}
     * @returns {LinkedListNode}
     */
    function recycleNode(obj, next, prev, data, deleteFn) {
        return obj.recycle(next, prev, data, deleteFn);
    }

    /**
     * @param next {LinkedListNode}=
     * @param prev {LinkedListNode}=
     * @param data {*}=
     * @param deleteFn {function(...)}
     * @returns {LinkedListNode}
     */
    function getNode(next, prev, data, deleteFn) {
        /*jshint validthis:true */
        var n;
        if (this.garbage) {
            n = this.garbage;
            this.garbage = n.next;
            return n.recycle(next, prev, data, deleteFn)
        }
        return pool.get(next, prev, data, deleteFn);
    }

    /**
     * @param conf {{}}=
     * @returns {{}}
     */
    function validateConfig(conf) {
        conf = conf || {};
        return {};
    }

    /**
     * @param node {Object}
     * @returns {function(...)}
     */
    function getDelete(node) {
        /*jshint validthis:true */
        var that = this;

        /**
         *  Delete a node
         */
        function doDelete() {
            if (node._isDeleted) {
                $log.warn('LinkedList: node deleted twice?');
                return null;
            }
            if (node === that.head) {
                return that.shift();
            }
            if (node === that.tail) {
                return that.pop();
            }
            node.next.prev = node.prev;
            node.prev.next = node.next;

            // return node for recycling
            pool.put(node);
            return node.data;
        }

        return doDelete;
    }

    /**
     * @param val {Object}
     */
    function push(val) {
        /*jshint validthis:true */
        if (!val) {
            return;
        }

        if (this.length === 0) {
            this.head.data = val;
            this.length += 1;
            return;
        } else if (this.length === 1) {
            this.tail.data = val;
            this.length += 1;
            return;
        }

        var n = this.getNode(null, this.tail, val);
        n.wrapDelete(getDelete.call(this, n));
        this.tail.next = n;
        this.tail = n;

        this.length += 1;
    }

    /**
     * @param val {Object}
     */
    function unshift(val) {
        /*jshint validthis:true */
        if (!val) {
            return;
        }

        if (this.length === 0) {
            this.head.data = val;
            this.length += 1;
            return;
        } else if (this.length === 1) {
            this.tail.data = this.head.data;
            this.head.data = val;
            this.length += 1;
            return;
        }

        var n = this.getNode(this.head, null, val);
        n.wrapDelete(getDelete.call(this, n));
        this.head.prev = n;
        this.head = n;
        this.length += 1;
    }

    /**
     * @returns {*}
     */
    function pop() {
        var result;
        /*jshint validthis:true */
        if (this.length === 0) {
            return null;
        } else if (this.length === 1) {
            result = this.head.data;
            this.head.data = null;
            this.length -= 1;
            return result;
        } else if (this.length === 2) {
            result = this.tail.data;
            this.tail.data = null;
            this.length -= 1;
            return result;
        }
        // list is longer'
        result = this.tail.data;
        pool.put(this.tail);
        this.tail = this.tail.prev;
        this.tail.next = null;
        this.length -= 1;
        return result;
    }

    /**
     * @returns {*}
     */
    function shift() {
        /*jshint validthis:true */
        var result;
        // List is almost empty
        if (this.length === 0) {
            return null;
        } else if (this.length === 1) {
            result = this.head.data;
            this.head.data = null;
            this.length -= 1;
            return result;
        } else if (this.length === 2) {
            result = this.head.data;
            this.head.data = this.tail.data;
            this.tail.data = null;
            this.length -= 1;
            return result;
        }

        // list is more populated
        result = this.head.data;
        pool.put(this.head);
        this.head = this.head.next;
        this.head.prev = null;
        this.length -= 1;
        return result;
    }

    /**
     * @param callback {function(...)}
     * @returns {LinkedList}
     */
    function walkForwards(callback) {
        /*jshint validthis:true */
        var obj = this.head;
        if (obj.data) {
            callback(obj.data, obj._delete);
        }
        while (obj.next !== null) {
            if (obj.next.data) {
                callback(obj.next.data, obj.next._delete);
            }
            obj = obj.next;
        }
        return this;

    }

    /**
     * @param callback {function(...)}
     * @returns {LinkedList}
     */
    function walkBackwards(callback) {
        /*jshint validthis:true */
        var obj = this.tail;
        if (obj.data) {
            callback.call(null, obj.data, obj._delete);
        }

        while (obj.prev !== null) {
            if (obj.prev.data) {
                callback(obj.prev.data, obj.prev._delete);
            }
            obj = obj.prev;
        }
        return this;
    }

    /**
     * @param callback {function(*, function)}
     * @param direction {string} 'reverse' forces iterator to start at tail
     * @returns {LinkedList}
     */
    function walk(callback, direction) {
        /*jshint validthis:true */
        if (!angular.isFunction(callback)) {
            return this;
        }
        if (direction === 'reverse') {
            return this.walkBackwards(callback);
        } else {
            return this.walkForwards(callback);
        }
    }

    function trunc() {
        /*jshint validthis:true */
        this.garbage = this.head.next;
        this.head.data = null;
        this.head.next = this.tail;
        this.tail.data = null;
        this.tail.prev = this.head;
        this.length = 0;
    }

    /**
     * @param conf {{}}=
     * @returns {LinkedList}
     * @constructor
     */
    function LinkedList(conf) {
        if (!(this instanceof LinkedList)) {
            return new LinkedList(conf);
        }

        this.garbage = null;
        this.length = 0;
        this.config = validateConfig(conf);
        this.head = this.getNode(null, null, null);
        this.tail = this.getNode(null, null, null);
        this.head.next = this.tail;
        this.tail.prev = this.head;
        this.head.wrapDelete(getDelete.call(this, this.head));
        this.tail.wrapDelete(getDelete.call(this, this.tail));
    }

    LinkedList.prototype.push = push;
    LinkedList.prototype.pop = pop;
    LinkedList.prototype.unshift = unshift;
    LinkedList.prototype.shift = shift;
    LinkedList.prototype.walk = walk;
    LinkedList.prototype.forEach = walk;
    LinkedList.prototype.walkForwards = walkForwards;
    LinkedList.prototype.walkBackwards = walkBackwards;
    LinkedList.prototype.trunc = trunc;
    LinkedList.prototype.getNode = getNode;

    return LinkedList;
}]);

