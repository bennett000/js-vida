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
            pool: conf.pool
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
        that = this;

        function garbageCollect() {
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
            list.forEach(function (el, i) {
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
}]);
