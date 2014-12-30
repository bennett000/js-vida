/**
 * file: map.js
 * Created by michael on 29/12/14.
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
angular.module('JSVida-Map2D', []).factory('xyToOffset', [function () {
    'use strict';

    /**
     * Convert an x/y into a number on a one dimensional line, *depends on this*
     * this.config.x is x boundary, this.config.y is y boundary
     * @param x {number}
     * @param y {number}
     * @returns {number}
     */
    function xyToOffset(x, y) {
        /*jshint validthis:true */
        x = +x;
        y = +y;
        if (x < 0) {
            x = this.config.x - Math.abs(x);
        }
        if (y < 0) {
            y = this.config.y - Math.abs(y);
        }
        if (x >= this.config.x) {
            x = x - this.config.x;
        }
        if (y >= this.config.y) {
            y = y - this.config.y;
        }

        return x + this.config.x * y;
    }

    return xyToOffset;
}]).factory('Map2d', ['xyToOffset', function (xyToOffset) {
    'use strict';
    /** @const */
    var defaultWidth = 128,
    /** @const */
    defaultHeight = 128;

    /**
     * @param conf {{ x: number=, y: number=, Constructor: function(...)=, factory: function(...)= }}
     * @returns {{x: number, y: number, Constructor: function(...)|null, factory: function(...)|null}}
     */
    function validateConfig(conf) {
        conf = conf || {};

        conf.Constructor = angular.isFunction(conf.Constructor) ?
                           conf.Constructor : null;

        conf.factory = angular.isFunction(conf.factory) ?
                       conf.factory : null;

        return {
            x: +conf.x || defaultWidth,
            y: +conf.y || defaultHeight,
            Constructor: conf.Constructor,
            factory: conf.factory
        };
    }

    /**
     * initializes an empty 2D map
     */
    function initMap() {
        /*jshint validthis:true */
        var i, j;
        this.map = [];
        for (i = 0; i < this.config.x; i += 1) {
            this.map[i] = [];
            for (j = 0; j < this.config.y; j += 1) {
                this.map[i].push(null);
            }
        }
    }

    /**
     * @param x {number}
     * @param y {number}
     * @param dx {number}
     * @param dy {number}
     * @param result {{ x: number, y: number }}
     * @returns {{ x: number, y: number }}
     */
    function getNeighbour(x, y, dx, dy, result) {
        /*jshint validthis:true*/
        if (!result) {
            result = {};
        }
        y = +y;
        dx = +dx;
        dy = +dy;
        result.x = x + dx;
        result.y = y + dy;

        if (+result.x >= this.config.x) {
            result.x = result.x - this.config.x;
        }
        if (+result.x < 0) {
            result.x = this.config.x - result.x;
        }
        if (result.y >= this.config.y) {
            result.y = result.y - this.config.y;
        }
        if (result.y < 0) {
            result.y = this.config.y - result.y;
        }
        return result;
    }

    function reset() {
        /*jshint validthis:true */
        initMap.call(this);
    }

    /**
     * Generic map class
     * @param conf {{ x: number, y: number, Constructor: function(...)=, factory: function(...)= }}
     * @returns {Map2d}
     * @constructor
     */
    function Map2d(conf) {
        if (!(this instanceof Map2d)) {
            return new Map2d(conf);
        }

        this.config = validateConfig(conf);
        this.reset();
    }

    Map2d.prototype.reset = reset;
    Map2d.prototype.getNeighbour = getNeighbour;

    return Map2d;
}]);
