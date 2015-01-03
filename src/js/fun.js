var angular    = {isFunction: function (val) { return typeof val === 'function'; }},
    ObjectPool = (function () {
        'use strict';

        /** @const */
        var defaultMax = 1000;

        /**
         * @param conf {{ max: number=, factory: function(...), recycle: function(...) }}
         * @throws without conf.recycle or conf.factory
         * @returns {{max: number, factory: function(...), recycle: function(...) }}
         */
        function validateConfig(conf) {
            conf = conf || {};

            conf.max = +conf.max || defaultMax;
            if (!angular.isFunction(conf.factory)) {
                throw new TypeError('ObjectPool: requires factory function');
            }
            if (!angular.isFunction(conf.recycle)) {
                throw new TypeError('ObjectPool: requires recycle function');
            }

            return {
                max: conf.max,
                factory: conf.factory,
                recycle: conf.recycle
            };
        }

        /**
         * @param conf {{ max: number=, factory: function(...), recycle: function(...) }}
         * @returns {ObjectPool}
         * @constructor
         */
        function ObjectPool(conf) {
            if (!(this instanceof ObjectPool)) {
                return new ObjectPool(conf);
            }

            this.config = validateConfig(conf);

            var pool = [],
                that = this;


            /**
             * @returns {*}
             */
            function get() {
                var args = Array.prototype.slice.call(arguments, 0);
                if (pool.length) {
                    return conf.recycle.apply(null,
                                              [pool.pop()].concat(args));
                }
                return conf.factory.apply(null, args);
            }

            /**
             * @param val {*}
             */
            function put(val) {
                if ((!val) || typeof val !== 'object') {
                    return;
                }
                pool.push(val);

                if (that.config.max < 1) {
                    return;
                }

                if (pool.length > that.config.max) {
                    empty();
                }
            }

            function empty() {
                pool = [];
            }

            /**
             * @returns {Number}
             */
            function size() {
                return pool.length;
            }

            this.get = get;
            this.put = put;
            this.empty = empty;
            this.size = size;
        }

        return ObjectPool;
    }()),
    LinkedList = (function () {
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
    }()),
    size       = 65535, seed,
    i, l       = new LinkedList(), a = [],
    aTotal     = 0, lTotal = 0, flTotal = 0,
    val        = '',
    rounds     = 5;

// seed
for (i = 0; i < size; i += 1) {
    seed = Date.now().toString(16) + Math.random();
    a.push(seed);
    l.push(seed);
}

function flTest(list) {

}

function test(list) {
    var start = +Date.now();
    list.forEach(function (el) {
        val = Date.now().toString(16) + Math.random();
    });
    return +Date.now() - start;
}

function flTest() {
    var start = +Date.now(), i = 0;
    for (i = 0; i < size; i += 1) {
        val = Date.now().toString(16) + Math.random();
    }
    return +Date.now() - start;
}

for (i = 0; i < rounds; i += 1) {
    flTotal += flTest(a);
}

for (i = 0; i < rounds; i += 1) {
    aTotal += test(a);
}

for (i = 0; i < rounds; i += 1) {
    lTotal += test(l);
}

console.log('results: ');
console.log('Array (forEach): ', aTotal / rounds, 'ms');
console.log('Array (for loop): ', aTotal / rounds, 'ms');
console.log('LinkedList: ', lTotal / rounds, 'ms');
