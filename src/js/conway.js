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
    'JSVida-ObjectPool'
]).factory('Conway', ['$timeout', 'makeListener', 'Map2d', 'ObjectPool', function ($timeout, makeListener, Map2d, ObjectPool) {
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
    minPop = 1,
    /** @const */
    maxPop = 8,
    /** @const */
    defaultWidth = 128,
    /** @const */
    defaultHeight = 128,
    /** @type {{ x: number, y: number }} */
    offsetTemp = {x: 0, y: 0};

    function getNeighbourStatus(map, x, y, dx, dy) {
        map.getNeighbour(x, y, dx, dy, offsetTemp);
        return map.get(offsetTemp.x, offsetTemp.y);
    }

    /**
     * @param map {Map2d}
     * @param x {number}
     * @param y {number}
     * @returns {number}
     */
    function liveNeighbours(map, x, y) {
        /** @type {number} */
        var count = 0;

        // top left
        if (getNeighbourStatus(map, x, y, -1, 1)) {
            count += 1;
        }

        // top
        if (getNeighbourStatus(map, x, y, 0, 1)) {
            count += 1;
        }

        // top right
        if (getNeighbourStatus(map, x, y, 1, 1)) {
            count += 1;
        }

        // mid left
        if (getNeighbourStatus(map, x, y, -1, 0)) {
            count += 1;
        }

        // mid right
        if (getNeighbourStatus(map, x, y, 1, 0)) {
            count += 1;
        }

        // bottom left
        if (getNeighbourStatus(map, x, y, -1, -1)) {
            count += 1;
        }

        // bottom
        if (getNeighbourStatus(map, x, y, 0, -1)) {
            count += 1;
        }

        // bottom right
        if (getNeighbourStatus(map, x, y, 1, -1)) {
            count += 1;
        }

        return count;
    }

    /**
     * @param map {Map2d}
     * @param changes {Array.<function(...)>}
     */
    function brute(map, changes) {
        /*jshint validthis:true */
        var that = this, isAlive;
        map.walk(function (cell, x, y) {
            var change = processCell.call(that, map, x, y);
            if (change === 1) {
                isAlive = true;
            } else {
                isAlive = false;
            }

            // change any of the changers
            if (cell !== change) {
                changes.push(function () {
                    map.set(x, y, change);
                });
                that.triggerSync('update', x, y, isAlive);
            }
        });

    }

    /**
     * @param map {Map2d}
     * @param x {number}
     * @param y {number}
     * @returns {number}
     */
    function processCell(map, x, y) {
        /*jshint validthis:true */
        /** @type {number} */
        var neighbours = liveNeighbours(map, x, y),
        cell = map.get(x, y);
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
     * @param birthing {Array.<{ x: number, y: number }>}
     * @param map {Map2d}
     * @param offsetPool {ObjectPool}
     * @param changes {Array.<function(...)>}
     * @param x {number}
     * @param y {number}
     */
    function lifeScanNeighbour(birthing, map, offsetPool, changes, x, y) {
        /*jshint validthis:true*/
        var that = this,
            change = processCell.call(this, map, x, y);
        // register births
        if (change === 1) {
            birthing.push(offsetPool.get(x, y));
            that.triggerSync('update', x, y, true);
            changes.push(function () {
                map.set(x, y, 1);
                console.log('birth', x, y, map.get(x, y));
            });
        }
    }

    /**
     * @param living {Array.<{ x: number, y: number }>}
     * @param birthing {Array.<{ x: number, y: number }>}
     * @param map {Map2d}
     * @param offsetPool {ObjectPool}
     * @param changes {Array.<function(...)>}
     */
    function lifeScan(living, birthing, map, offsetPool, changes) {
        /*jshint validthis:true */
        var i, j, that = this, scanKey, scanned = {};
        living.forEach(function (cell, position) {
            var x = cell.x, y = cell.y;
            // skip garbage
            if (cell === null) { return; }

            if (map.get(x, y) !== 1) {
                console.log('what', x, y);
            }
            // process main cell, which must be alive, but it can die
            if (!processCell.call(that, map, x, y)) {
                // object pooling
                offsetPool.put(cell);
                // nullify
                living[position] = null;
                // trigger
                that.triggerSync('update', x, y, false);
                changes.push(function () {
                    map.set(x, y, 0);
                    console.log('kill', x, y, map.get(x, y), living[position]);
                });
            }

            // process the neighbours
            for (i = -1; i < 2; i += 1) {
                for (j = -1; j < 2; j += 1) {
                    // skip origin
                    if ((i === 0) && (j === 0)) {
                        continue;
                    }
                    // process a neighbour
                    offsetTemp = map.getNeighbour(x, y, i, j, offsetTemp);
                    // skip living, as they will be processed in turn
                    if (map.get(offsetTemp.x, offsetTemp.y) === 1) {
                        return;
                    }
                    scanKey = offsetTemp.x + '.' + offsetTemp.y;
                    // skip scanned
                    if (scanned[scanKey]) {
                        return;
                    }
                    lifeScanNeighbour.call(that, birthing, map, offsetPool,
                                           changes, offsetTemp.x, offsetTemp.y);
                    scanned[scanKey] = true;
                }
            }
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
            /** @type {Map2d} */
            buffer,
            /** @type {Array.<{ x: number, y: number}>} */
            livingList = [],
            /** @type {Array.<{ x: number, y: number}>} */
            birthingList = [],
            /** @type {boolean} */
            doStop = false,
            /** @type {boolean} */
            isRunning = false,
            /** @type {ObjectPool} */
            offsetPool = new ObjectPool({factory: newPoint});
        var started = false;

        /**
         * @params x {number=}
         * @params y {number=}
         * @returns {{x: number, y: number}}
         */
        function newPoint(x, y) {
            x = +x || 0;
            y = +y || 0;
            return {x: x, y: y};
        }

        function onTick() {
            var changes = [],
                birthingList = [];
            if (doStop) {
                doStop = false;
                isRunning = false;
                return;
            }
            console.log('LL1', livingList.length);
            //brute.call(that, buffer, changes);
            lifeScan.call(that, livingList, birthingList,
                          buffer, offsetPool, changes);
            that.triggerSync('tick');
            changes.forEach(function (change) {
                change();
            });

            console.log('LL2', livingList.length);
            livingList = livingList.filter(function (el) {
                return el !== null;
            }).concat(birthingList);
            console.log('LL3', livingList.length);

            $timeout(onTick, that.config.tickInterval);
            if (!started) {
                started = true;
                console.log('first tick over');
            }
        }

        function start() {
            if (doStop) {
                return;
            }
            isRunning = true;
            onTick();
            return buffer;
        }

        function stop() {
            doStop = true;
        }

        function init() {
            var offset;
            // Initialize Buffers
            livingList = [];
            buffer = new Map2d(conf).walk(function zero(cell, x, y) {
                /*jshint validthis: true */
                if (cell) {
                    livingList.push(offsetPool.get(x, y));
                    this.set(x, y, 1);
                } else {
                    this.set(x, y, 0);
                }

            });
            buffer.config.wrapMode = 'sphere';
        }

        this.start = start;
        this.stop = stop;

        init();
    }

    Conway.brute = brute;
    Conway.validateConfig = validateConfig;
    Conway.clamp = clamp;
    Conway.lifeScan = lifeScan;
    Conway.liveNeighbours = liveNeighbours;

    return Conway;
}]);
