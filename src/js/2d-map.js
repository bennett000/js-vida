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
}]).factory('Map2dCell', [function () {
    'use strict';

    function Map2dCell(x, y, data, tl, t, tr, l, r, bl, b, br) {
        if (!(this instanceof Map2dCell)) {
            return new Map2dCell(x, y, data, tl, t, tr, l, r, bl, b, br);
        }

        this.x = +x || 0;
        this.y = +y || 0;

        this.data = data;
        this.isScanned = false;

        this.tl = tl || null;
        this.t = t || null;
        this.tr = tr || null;

        this.bl = bl || null;
        this.b = b || null;
        this.br = br || null;

        this.l = l || null;
        this.r = r || null;
    }

    return Map2dCell;
}]).factory('Map2d', ['xyToOffset', 'Map2dCell', function (xyToOffset, Map2dCell) {
    'use strict';
    /** @const */
    var defaultWidth = 128,
    /** @const */
    defaultHeight = 128,
    /** @const */
    defaultWrapMode = 'flat';

    /**
     * @param conf {{ x: number=, y: number=, Constructor: function(...)=, factory: function(...)=, wrapMode: string= }}
     * @returns {{x: number, y: number, Constructor: function(...)|null, factory: function(...)|null, wrapMode: string }}
     */
    function validateConfig(conf) {
        conf = conf || {};

        conf.Constructor = angular.isFunction(conf.Constructor) ?
                           conf.Constructor : null;

        conf.factory = angular.isFunction(conf.factory) ?
                       conf.factory : null;

        conf.wrapMode = conf.wrapMode || defaultWrapMode;

        if (!Array.isArray(conf.seed)) {
            conf.seed = null;
        }

        return {
            x: +conf.x || defaultWidth,
            y: +conf.y || defaultHeight,
            seed: conf.seed,
            Constructor: conf.Constructor,
            factory: conf.factory,
            wrapMode: conf.wrapMode
        };
    }

    /**
     * initializes an empty 2D map
     */
    function initMap() {
        /*jshint validthis:true */
        var i, j;
        if (Array.isArray(this.config.seed)) {
            return load.call(this);
        }
        this.map = [];
        for (i = 0; i < this.config.x; i += 1) {
            this.map[i] = [];
            for (j = 0; j < this.config.y; j += 1) {
                this.map[i].push(new Map2dCell(i, j, null));
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
    function getNeighbourFlat(x, y, dx, dy, result) {
        /*jshint validthis:true */
        // go
        result.x = x + dx;
        result.y = y + dy;
        if (+result.x >= this.config.x) {
            result.x = result.x - this.config.x;
        }
        if (+result.x < 0) {
            result.x = this.config.x - Math.abs(result.x);
        }
        if (result.y >= this.config.y) {
            result.y = result.y - this.config.y;
        }
        if (result.y < 0) {
            result.y = this.config.y - Math.abs(result.y);
        }
        return result;
    }

    /**
     * @param result {{ x: number, y: number }}
     */
    function sphereMapWrapX(result) {
        /*jshint validthis:true */
        var half = Math.floor(this.config.x / 2);

        if (result.x >= half) {
            result.x = Math.abs(half - result.x);
        } else {
            result.x = half + result.x;
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
    function getNeighbourSphere(x, y, dx, dy, result) {
        /*jshint validthis:true */
        // go
        result.x = x + dx;
        result.y = y + dy;
        if (+result.x >= this.config.x) {
            result.x = result.x - this.config.x;
        }
        if (+result.x < 0) {
            result.x = this.config.x - Math.abs(result.x);
        }
        if (result.y >= this.config.y) {
            result.y = this.config.y - Math.abs(result.y - this.config.y) - dy;
            sphereMapWrapX.call(this, result);
        }
        if (result.y < 0) {
            result.y = Math.abs(result.y) + dy;
            sphereMapWrapX.call(this, result);
        }
        return result;
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
            result = {x: 0, y: 0};
        }
        x = +x;
        y = +y;
        dx = +dx;
        dy = +dy;

        // invalid cases
        if (dx >= this.config.x) {
            dx = this.config.x - 1;
        }
        if (dy >= this.config.y) {
            dy = this.config.y - 1;
        }

        if (Math.abs(dx) >= this.config.x) {
            dx = (this.config.x - 1) * -1;
        }
        if (Math.abs(dy) >= this.config.y) {
            dy = (this.config.y - 1) * -1;
        }

        if (this.config.wrapMode === 'sphere') {
            return getNeighbourSphere.call(this, x, y, dx, dy, result);
        } else {
            return getNeighbourFlat.call(this, x, y, dx, dy, result);
        }
    }

    function getNeighbourEl(x, y, dx, dy, tempObj) {
        /*jshint validthis:true */
        this.getNeighbour(x, y, dx, dy, tempObj);
        return this.map[tempObj.x][tempObj.y];
    }

    function reset() {
        /*jshint validthis:true */
        initMap.call(this);
    }

    /**
     * @param x {number}
     * @param y {number}
     * @returns {boolean}
     */
    function checkXY(x, y) {
        /*jshint validthis:true */
        if (x < 0) {
            return false;
        }
        if (y < 0) {
            return false;
        }
        if (x >= this.config.x) {
            return false;
        }
        if (y >= this.config.y) {
            return false;
        }
        return true;
    }

    /**
     * Checks this for a given configuration/seed if not return array
     * @param array2d {Array.<Array>}
     * @returns {Array.<Array.<Map2dCell>>}
     */
    function validateLoadData(array2d) {
        /*jshint validthis:true */
        var that = this;
        array2d = array2d || this.config.seed;

        /**
         * @param col {*}
         * @returns {Array.<Map2dCell>}
         */
        function checkCols(col, i) {
            if (!Array.isArray(col)) {
                return [];
            }
            if (col.length > that.config.y) {
                return [];
            }
            return col.map(function (data, j) {
                return new Map2dCell(i, j, data);
            });
        }

        if (!Array.isArray(array2d)) {
            return [];
        }
        if (array2d.length > this.config.x) {
            return [];
        }

        return array2d.map(checkCols);
    }

    function assignNeighbours() {
        /*jshint validthis:true */

        var i, j, point = {x: 0, y: 0};
        for (i = 0; i < this.config.x; i += 1) {
            for (j = 0; j < this.config.y; j += 1) {
                this.map[i][j].tl = this.getNeighbourEl(i, j, -1, 1, point);
                this.map[i][j].t = this.getNeighbourEl(i, j, 0, 1, point);
                this.map[i][j].tr = this.getNeighbourEl(i, j, 1, 1, point);

                this.map[i][j].bl = this.getNeighbourEl(i, j, -1, -1, point);
                this.map[i][j].b = this.getNeighbourEl(i, j, 0, -1, point);
                this.map[i][j].br = this.getNeighbourEl(i, j, 1, -1, point);

                this.map[i][j].l = this.getNeighbourEl(i, j, -1, 0, point);
                this.map[i][j].r = this.getNeighbourEl(i, j, 1, 0, point);
            }
        }
    }

    /**
     * @param array2d {*}
     */
    function load(array2d) {
        /*jshint validthis:true */
        this.map = validateLoadData.call(this, array2d);
        var i, j;

        for (i = 0; i < this.config.x; i += 1) {
            // fill out short x's
            if (this.map.length <= i) {
                this.map[i] = [];
            }
            for (j = 0; j < this.config.y; j += 1) {
                // fill out short y's
                if (this.map[i].length <= j) {
                    this.map[i][j] = new Map2dCell(i, j, null);
                }
            }
        }
        this.assignNeighbours();
    }

    /**
     * @param x {number}
     * @param y {number}
     * @param val {*}
     * @returns {boolean}
     */
    function set(x, y, val) {
        /*jshint validthis:true */
        if (!checkXY.call(this, x, y)) {
            return false;
        }
        this.map[x][y].data = val;
        return true;
    }

    /**
     * @param x {number}
     * @param y {number}
     * @returns {*}
     */
    function get(x, y) {
        /*jshint validthis:true */
        if (!checkXY.call(this, x, y)) {
            return;
        }
        return this.map[x][y].data;
    }

    /**
     * Getter/Setter
     * @param x {number}
     * @param y {number}
     * @param val
     */
    function cell(x, y, val) {
        /*jshint validthis:true */
        if (val === undefined) {
            return this.get(x, y);
        }
        return this.set(x, y, val);
    }

    /**
     * Walks the map left to right, top to bottom and calls back at each element
     * with the cell, the x coordinate, and the y coordinate
     *
     * @param callback {function(*, number, number)}
     * @returns {Map2d}
     */
    function walk(callback) {
        /*jshint validthis:true */
        if (!angular.isFunction(callback)) {
            return;
        }
        var i, j;
        for (i = 0; i < this.config.x; i += 1) {
            for (j = 0; j < this.config.y; j += 1) {
                callback.call(this, this.map[i][j].data, i, j, this.map[i][j]);
            }
        }
        return this;
    }

    /**
     * @returns {Map2d}
     */
    function clone() {
        /*jshint validthis:true */
        // use the same config
        var m = new Map2d(this.config);
        // use the current copy of the map
        m.map = this.map.map(function (el) {
            return el.map(function (cell) { return cell; });
        });

        return m;
    }

    /**
     * Generic map class
     * @param conf {{ x: number, y: number, Constructor: function(...)=, factory: function(...)=, seed: Array.<Array>, wrapMode: string= }}
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

    Map2d.prototype.set = set;
    Map2d.prototype.get = get;
    Map2d.prototype.cell = cell;
    Map2d.prototype.load = load;
    Map2d.prototype.walk = walk;
    Map2d.prototype.reset = reset;
    Map2d.prototype.clone = clone;
    Map2d.prototype.getNeighbour = getNeighbour;
    Map2d.prototype.getNeighbourEl = getNeighbourEl;
    Map2d.prototype.validateLoadData = validateLoadData;
    Map2d.prototype.assignNeighbours = assignNeighbours;

    return Map2d;
}]);
