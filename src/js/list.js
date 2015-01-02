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
]).factory('TypedList', ['ObjectPool', function (ObjectPool) {
    'use strict';

    function validateConfig(conf) {
        conf = conf || {};

        if (!angular.isFunction(conf.factory)) {
            throw new TypeError('TypedList requires a factory function');
        }

        return {
            max: conf.max,
            factory: conf.factory
        };
    }


    function TypedList(conf) {
        if (!(this instanceof TypedList)) {
            return new TypedList(conf);
        }

        this.config = validateConfig(conf);

        /** @type {ObjectPool} */
        var pool = new ObjectPool({
                                      factory: this.config.factory,
                                      max: this.config.max
                                  }),
        /** @type {Array.<Object|null>} */
        list = [],
        that = this;

        function garbageCollect() {
            list = list.filter(function (el) {
                return el;
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
                if (el === null) {
                    return;
                }
                callback.call(that, el, i);
            });
            return that;
        }

        /**
         * @param offset {number}
         * @returns {boolean}
         */
        function deleteEl(offset) {
            if ((offset >= list.length) || (offset < 0)) {
                return false;
            }
            pool.put(list[offset]);
            list[offset] = null;
            return true;
        }

        /**
         * @param val {Object}
         */
        function push(val) {
            if ((val) && (typeof val === 'object')) {
                list.push(val);
            }
        }

        function size() {
            return list.length;
        }


        this.gc = garbageCollect;
        this.walk = walk;
        this.size = size;
        this.newEl = pool.get;
        this.delete = deleteEl;
        this.push = push;
    }

    return TypedList;
}]);
