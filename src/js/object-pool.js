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
angular.module('JSVida-ObjectPool', [
]).factory('ObjectPool', [function () {
    'use strict';

    /** @const */
    var defaultMax = 1000;

    /**
     * @param conf {{ max: number=, factory: function(...), validate: function(...)= }}
     * @returns {{max: number, factory: function(...), validate: function(...) }}
     */
    function validateConfig(conf) {
        /*jshint validthis:true */
        conf = conf || {};

        conf.max = +conf.max || defaultMax;
        conf.factory = angular.isFunction(conf.factory) ?
                       conf.factory : angular.noop;
        conf.validate = angular.isFunction(conf.validate) ?
                       conf.validate : function (el) { return el; };

        return {
            max : conf.max,
            factory : conf.factory,
            validate: conf.validate
        };
    }

    /**
     * @param conf {{ max: number=, factory: function(...), validate: function(...)= }}
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
                return pool.pop();
            }
            return conf.factory.apply(null, args);
        }

        /**
         * @param val {*}
         */
        function put(val) {
            val = that.config.validate(val);
            if (val === undefined) {
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
