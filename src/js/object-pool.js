/**
 * file: object-pool
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
angular.module('JSVida-ObjectPool', []).factory('ObjectPool', [function () {
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
         * arguments do not scale well which is sadly why this is fixed
         * @returns {*}
         */
        function get(a, b, c, d, e, f, g) {
            if (pool.length) {
                return conf.recycle(pool.pop(), a, b, c, d, e, f, g);
            }
            return conf.factory(a, b, c, d, e, f, g);
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
}]);
