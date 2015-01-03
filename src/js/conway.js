/**
 * file: conway.js
 * Created by michael on 27/12/14.
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
angular.module('JSVida-Conway', [
    'JSVida',
    'JSVida-Map2D',
    'JSVida-List',
    'JSVida-ObjectPool'
]).factory('Conway', ['$timeout', 'makeListener', 'Map2d', 'ObjectPool', 'LinkedList', function ($timeout, makeListener, Map2d, ObjectPool, LinkedList) {
    'use strict';

    /** @const */
    var defaultPopMin = 2,
    /** @const */
    defaultPopMax = 3,
    /** @const */
    defaultTickInterval = 150,
    /** @const */
    minTickInterval = 15,
    /** @const */
    maxTickInterval = 5000,
    /** @const */
    tickTimerMod = 100,
    /** @const */
    minPop = 1,
    /** @const */
    maxPop = 8,
    /** @const */
    defaultWidth = 128,
    /** @const */
    defaultHeight = 128,
    /** @type ObjectPool */
    pool = new ObjectPool({
                              factory: newPoint,
                              recycle: recyclePoint
                          });


    /**
     * @param x {number}
     * @param y {number}
     * @param dx {number}
     * @param dy {number}
     * @returns {*}
     */
    function getNeighbourValue(x, y, dx, dy) {
        /*jshint validthis:true*/
        var offsetTemp = pool.get(), nx, ny;
        this.map.getNeighbour(x, y, dx, dy, offsetTemp);
        nx = offsetTemp.x;
        ny = offsetTemp.y;
        pool.put(offsetTemp);
        return this.map.get(nx, ny);
    }

    /**
     * @params x {number=}
     * @params y {number=}
     * @returns {{x: number, y: number}}
     */
    function newPoint(x, y) {
        x = +x || 0;
        y = +y || 0;
        return {
            x: x,
            y: y,
            tl: null,
            t: null,
            tr: null,
            l: null,
            r: null,
            bl: null,
            b: null,
            br: null
        };
    }

    /**
     * @params obj {Object}
     * @params x {number=}
     * @params y {number=}
     * @returns {{x: number, y: number}}
     */
    function recyclePoint(obj, x, y) {
        obj.x = +x || 0;
        obj.y = +y || 0;
        obj.tl = null;
        obj.t = null;
        obj.tr = null;
        obj.l = null;
        obj.r = null;
        obj.bl = null;
        obj.b = null;
        obj.br = null;
        return obj;
    }

    /**
     * @param x {number}
     * @param y {number}
     * @returns {number}
     */
    function liveNeighbours(x, y) {
        /*jshint validthis:true */
        /** @type {number} */
        var count = 0,
        offsetTemp = pool.get();

        // top left
        if (this.getNeighbourValue(x, y, -1, 1, offsetTemp)) {
            count += 1;
        }

        // top
        if (this.getNeighbourValue(x, y, 0, 1, offsetTemp)) {
            count += 1;
        }

        // top right
        if (this.getNeighbourValue(x, y, 1, 1, offsetTemp)) {
            count += 1;
        }

        // mid left
        if (this.getNeighbourValue(x, y, -1, 0, offsetTemp)) {
            count += 1;
        }

        // mid right
        if (this.getNeighbourValue(x, y, 1, 0, offsetTemp)) {
            count += 1;
        }

        // bottom left
        if (this.getNeighbourValue(x, y, -1, -1, offsetTemp)) {
            count += 1;
        }

        // bottom
        if (this.getNeighbourValue(x, y, 0, -1, offsetTemp)) {
            count += 1;
        }

        // bottom right
        if (this.getNeighbourValue(x, y, 1, -1, offsetTemp)) {
            count += 1;
        }

        pool.put(offsetTemp);
        return count;
    }

    /**
     * @param changes {Array.<function(...)>}
     */
    function brute(changes) {
        /*jshint validthis:true */
        var that = this, isAlive, offsetTemp = {x: 0, y: 0};
        this.map.walk(function (cell, x, y) {
            var change = that.processCell(x, y, offsetTemp);
            if (change === 1) {
                isAlive = true;
            } else {
                isAlive = false;
            }

            // change any of the changers
            if (cell !== change) {
                changes.push(function () {
                    that.map.set(x, y, change);
                });
                that.triggerSync('update', x, y, isAlive);
            }
        });
    }

    /**
     * @param x {number}
     * @param y {number}
     * @returns {number}
     */
    function processCell(x, y) {
        /*jshint validthis:true */
        /** @type {number} */
        var neighbours = this.liveNeighbours(x, y),
        cell = this.map.get(x, y);
        // alive cases
        if (cell === 1) {
            // under pop case
            if (neighbours < this.config.popMin) {
                return 0;
            }
            // even pop case
            if (neighbours <= this.config.popMax) {
                return 1;
            }
            // over pop case
            return 0;
        }
        // dead cases

        // birth case
        if (neighbours === this.config.popMax) {
            return 1;
        }
        // dead is dead case
        return 0;
    }

    /**
     * @param cell {Object}
     * @param changes {Array.<function>}
     * @param deleteFn {function(...)}
     */
    function lifeScanMainCell(cell, changes, deleteFn) {
        /*jshint validthis:true */
        // process main cell, which must be alive, but it can die
        var that = this, x = +cell.x, y = +cell.y;
        if (!this.processCell(x, y)) {
            // trigger
            this.triggerSync('update', x, y, false);
            changes.push(function deathOrigin() {
                that.map.set(x, y, 0);
                pool.put(deleteFn());
            });
        }
    }

    /**
     * @param changes {Array.<function(...)>}
     * @param x {number}
     * @param y {number}
     */
    function lifeScanNeighbour(changes, x, y) {
        /*jshint validthis:true*/
        var that = this,
            change = this.processCell(x, y);
        // register births
        if (change === 1) {
            that.triggerSync('update', x, y, true);
            changes.push(function lifeScanBirth() {
                that.map.set(x, y, 1);
                that.livingList.push(pool.get(x, y));
            });
        }
    }

    function lifeScanNeighbours(cell, changes, scanned) {
        /*jshint validthis:true*/
        var i, j, neighbourTemp, scanKey;

        if (cell.tl) {

        } else {
            cell.tl = pool.get();
        }

        if (cell.t) {

        } else {
            cell.t = pool.get();
        }

        if (cell.tr) {

        } else {
            cell.tr = pool.get();
        }

        // process the neighbours
        for (i = -1; i < 2; i += 1) {
            for (j = -1; j < 2; j += 1) {
                // skip origin
                if ((i === 0) && (j === 0)) {
                    continue;
                }
                // get from pool
                neighbourTemp = pool.get();
                // process a neighbour
                this.map.getNeighbour(x, y, i, j, neighbourTemp);
                // skip living, as they will be processed in turn
                if (this.map.get(neighbourTemp.x, neighbourTemp.y) === 1) {
                    continue;
                }
                scanKey = neighbourTemp.x + '.' + neighbourTemp.y;
                // skip scanned
                if (scanned[scanKey]) {
                    continue;
                }
                this.lifeScanNeighbour(changes, neighbourTemp.x,
                                       neighbourTemp.y);
                scanned[scanKey] = true;
                // put back in pool
                pool.put(neighbourTemp);
            }
        }
    }

    /**
     * @param changes {Array.<function(...)>}
     */
    function lifeScan(changes) {
        /*jshint validthis:true */
        var that = this,
            scanned = {};

        this.livingList.walk(function lifeScanWalk(cell, deleteFn) {
            lifeScanMainCell.call(that, cell, changes, deleteFn);
            lifeScanNeighbours.call(that, cell, changes, scanned);
        });
    }

    /**
     * @param val {number}
     * @param min {number}
     * @param max {number}
     * @returns {number}
     */
    function clamp(val, min, max) {
        if (+val < min) {
            return min;
        }
        if (+val > max) {
            return max;
        }
        return +val;
    }

    /**
     * @param conf {{ x: number, y: number, seed: Array.<number>=, tickInterval: number=, popMin: number=, popMax: number= }}
     * @returns {{ x: number, y: number, seed: Array.<number>, tickInterval: number, popMin: number, popMax: number }}
     */
    function validateConfig(conf) {
        conf = conf || {};
        conf.x = +conf.x || defaultWidth;
        conf.y = +conf.y || defaultHeight;
        if (!Array.isArray(conf.seed)) {
            conf.seed = [];
        }
        conf.tickInterval = clamp(+conf.tickInterval, minTickInterval,
                                  maxTickInterval) || defaultTickInterval;
        conf.popMin = clamp(+conf.popMin, minPop, maxPop) || defaultPopMin;
        conf.popMax = clamp(+conf.popMax, minPop, maxPop) || defaultPopMax;

        // force defaults on invalid
        if (conf.popMax < conf.popMin) {
            conf.popMin = defaultPopMin;
            conf.popMax = defaultPopMax;
        }

        return {
            x: +conf.x,
            y: +conf.y,
            seed: conf.seed,
            tickInterval: +conf.tickInterval,
            popMin: +conf.popMin,
            popMax: +conf.popMax
        };
    }

    /**
     * @param conf {{ x: number, y: number, seed: Array.<Array>=, tickInterval: number=, popMin: number=, popMax: number= }}
     * @returns {Conway}
     * @constructor
     */
    function Conway(conf) {
        if (!(this instanceof Conway)) {
            return new Conway(conf);
        }

        this.config = validateConfig(conf);

        var that = makeListener(this),
            /** @type {boolean} */
            doStop = false,
            /** @type {boolean} */
            isRunning = false,
            /** @type {number} */
            tickCounter = 0,
            /** @type {number} */
            tickTime = 0;


        function onTick() {
            var changes = [],
                /** @type {number} */
                start = +Date.now();

            if (doStop) {
                doStop = false;
                isRunning = false;
                return;
            }
            //that.brute(changes);
            that.lifeScan(changes);
            that.triggerSync('tick');
            changes.forEach(function (change) {
                change();
            });

            tickCounter += 1;
            tickTime += +Date.now() - start;
            if (tickCounter % tickTimerMod === 0) {
                console.info('tickTime avg over ' +
                             tickTimerMod + ' ' +
                             Math.floor((tickTime / tickCounter)) + 'ms');
                tickCounter = 0;
                tickTime = 0;
            }
            $timeout(onTick, that.config.tickInterval);
        }

        function start() {
            if (doStop) {
                return;
            }
            isRunning = true;
            onTick();
            return that.map;
        }

        function stop() {
            doStop = true;
        }

        function init() {
            /** @type {Array.<{ x: number, y: number}>} */
            that.livingList = new LinkedList();
            // Initialize Buffers
            that.map = new Map2d(that.config).walk(function zero(cell, x, y) {
                /*jshint validthis: true */
                if (cell) {
                    that.livingList.push(pool.get(x, y));
                    this.set(x, y, 1);
                } else {
                    this.set(x, y, 0);
                }
            });
            that.map.config.wrapMode = 'sphere';
        }

        this.start = start;
        this.stop = stop;

        init();
    }

    Conway.validateConfig = validateConfig;
    Conway.clamp = clamp;
    Conway.newPoint = newPoint;
    Conway.prototype.processCell = processCell;
    Conway.prototype.liveNeighbours = liveNeighbours;
    Conway.prototype.getNeighbourValue = getNeighbourValue;
    Conway.prototype.brute = brute;
    Conway.prototype.lifeScan = lifeScan;
    Conway.prototype.lifeScanNeighbour = lifeScanNeighbour;

    return Conway;
}]);
