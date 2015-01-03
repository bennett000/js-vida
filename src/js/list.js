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
]).factory('TypedList', ['ObjectPool', '$log', function (ObjectPool, $log) {
    'use strict';

    /** @const */
    var garbageLimit = 128;

    /**
     * @param data {*=}
     * @returns {{data: (*|null)}}
     */
    function newTypeTransport(data) {
        return {
            data: data || null
        };
    }

    /**
     * @param obj {Object}
     * @param data {*=}
     * @returns {{data: (*|null)}}
     */
    function recycleTypeTransport(obj, data) {
        obj.data = data;
        return obj;
    }

    /**
     * @param conf {{ factory: function(...), max: number=, pool: ObjectPool= }}
     * @throws if factory is not a function
     * @returns {{max: number=, factory: function(...), pool: ObjectPool }}
     */
    function validateConfig(conf) {
        /*jshint validthis:true */
        conf = conf || {};

        if (!angular.isFunction(conf.factory)) {
            throw new TypeError('TypedList requires a factory function');
        }

        if (!angular.isFunction(conf.recycle)) {
            throw new TypeError('TypedList requires a recycle function');
        }

        conf.pool = conf.pool || new ObjectPool({
                                                    factory: conf.factory,
                                                    recycle: conf.recycle,
                                                    max: conf.max
                                                });

        return {
            max: conf.max,
            factory: conf.factory,
            pool: conf.pool,
            garbageLimit: conf.garbageLimit || garbageLimit
        };
    }


    /**
     * @param conf {{ factory: function(...), max: number=, pool: ObjectPool= }}
     * @returns {TypedList}
     * @constructor
     */
    function TypedList(conf) {
        if (!(this instanceof TypedList)) {
            return new TypedList(conf);
        }

        this.config = this.validateConfig(conf);
        this.pool = this.config.pool;

        /** @type {ObjectPool} */
        var transportPool = new ObjectPool({
                                               factory: newTypeTransport,
                                               recycle: recycleTypeTransport
                                           }),
        /** @type {Array.<Object|null>} */
        list = [],
        /** @type {Array.<Object|null>} */
        garbage = 0,
        that = this;

        function garbageCollect() {
            if (garbage < that.config.garbageLimit) {
                return;
            }
            list = list.filter(function (el) {
                if (el.data === null) {
                    transportPool.put(el);
                    return false;
                }
                return true;
            });
        }

        /**
         * @param callback {function(...)}
         * @returns {TypedList}
         */
        function walk(callback) {
            if (!angular.isFunction(callback)) {
                return that;
            }
            list.forEach(function typedListWalker(el) {
                if (el.data === null) {
                    return;
                }
                callback.call(that, el.data);
            });
            return that;
        }

        /**
         * @returns {function(...)}
         */

        function push() {
            var args = Array.prototype.slice.call(arguments, 0),
                container = transportPool.get(that.pool.get.apply(that.pool,
                                                                  args)),
                isDeleted = false;

            container.data._delete = doDelete;

            list.push(container);

            /**
             * Deletes the node
             */
            function doDelete() {
                if (isDeleted) {
                    $log.warn('VidaList: delete called twice on element');
                    return;
                }
                isDeleted = true;
                that.pool.put(container.data);
                container.data = null;
                garbage += 1;
            }

            return doDelete;
        }

        /**
         * @returns {Number}
         */
        function size() {
            return list.length;
        }


        this.gc = garbageCollect;
        this.walk = walk;
        this.size = size;
        this.push = push;
    }

    TypedList.prototype.validateConfig = validateConfig;

    return TypedList;
}]).factory('LinkedList', ['ObjectPool', function (ObjectPool) {
    'use strict';
    /** @const */
    var nodeType = 'vida-node',
    pool = new ObjectPool({
                              factory: newNode,
                              recycle: recycleNode
                          });

    /**
     * @param next {{ next: Object, prev: Object, data: * }}=
     * @param prev {{ next: Object, prev: Object, data: * }}=
     * @param data {*}=
     * @param deleteFn {function(...)}
     * @returns {{next: Object, prev: Object, data: * }}
     */
    function newNode(next, prev, data, deleteFn) {
        return {
            next: next || null,
            prev: prev || null,
            data: data || null,
            _type: nodeType,
            _delete: deleteFn
        };
    }

    /**
     * @param obj {Object}
     * @param next {{ next: Object=, prev: Object=, data: *= }}=
     * @param prev {{ next: Object=, prev: Object=, data: *= }}=
     * @param data {*}=
     * @param deleteFn {function(...)}
     * @returns {{next: Object, prev: Object, data: * }}
     */
    function recycleNode(obj, next, prev, data, deleteFn) {
        obj.next = next;
        obj.prev = prev;
        obj.data = data;
        obj._delete = deleteFn;
        return obj;
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

        var n = pool.get();
        n.prev = this.tail;
        n.next = null;
        n.data = val;
        n._delete = getDelete.call(this, n);
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

        var n = pool.get();
        n.next = this.head;
        n.prev = null;
        n.data = val;
        n._delete = getDelete.call(this, n);
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
     * @param callback {function(*, function)}
     * @param direction {string} 'reverse' forces iterator to start at tail
     * @returns {walk}
     */
    function walk(callback, direction) {
        /*jshint validthis:true */
        if (!angular.isFunction(callback)) {
            return this;
        }
        var obj;
        if (direction === 'reverse') {
            direction = 'prev';
            obj = this.tail;
        } else {
            direction = 'next';
            obj = this.head;
        }
        if (this.head.data) {
            callback.call(null, obj.data, obj._delete);
        }
        while (obj[direction] !== null) {
            if (obj[direction].data) {
                callback.call(null, obj[direction].data,
                              obj[direction]._delete);
            }
            obj = obj[direction];
        }
        return this;
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

        this.length = 0;
        this.config = validateConfig(conf);
        this.head = pool.get(null, null, null, angular.noop);
        this.tail = pool.get(null, null, null, angular.noop);
        this.head.next = this.tail;
        this.tail.prev = this.head;
        this.head.delete = getDelete.call(this, this.head);
        this.tail.delete = getDelete.call(this, this.tail);
    }

    LinkedList.prototype.push = push;
    LinkedList.prototype.pop = pop;
    LinkedList.prototype.unshift = unshift;
    LinkedList.prototype.shift = shift;
    LinkedList.prototype.walk = walk;
    LinkedList.prototype.forEach = walk;

    return LinkedList;
}]);
