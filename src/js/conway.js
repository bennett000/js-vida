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
    'JSVida-Map2D'
]).factory('Conway', ['$timeout', 'makeListener', 'Map2d', function ($timeout, makeListener, Map2d) {
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
     * @param changes {Array}
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
        if (neighbours === 3) {
            return 1;
        }
        // dead is dead case
        return 0;
    }

    /**
     * @param living {Array.<number>}
     * @param birthing {Array.<number>}
     * @param seed {Array.<number>}
     * @param result {Array.<number>}
     */
    function lifeScan(living, birthing, seed, result) {
        /*jshint validthis:true */
        var offset, i, j, that = this;
        living.forEach(function (cell, position) {
            // skip garbage
            if (cell === null) { return; }

            // process main cell, which must be alive, but it can die
            if (!processCell.call(that, seed, result, cell,
                                  that.config.x, that.config.y)) {
                living[position] = null;
                that.triggerSync('update', cell, false);
            }

            // process the neighbours
            for (i = -1; i < 2; i += 1) {
                for (j = -1; j < 2; j += 1) {
                    // skip origin
                    if ((i === 0) && (j === 0)) {
                        continue;
                    }
                    // process a neighbour
                    offset = getNeighbour(cell, i, j,
                                          that.config.x, that.config.y);
                    if ((!seed[offset]) && (birthing.indexOf(offset) === -1)) {
                        // if a birth happens, register it
                        if (processCell.call(that, seed, result, offset,
                                             that.config.x, that.config.y)) {
                            birthing.push(offset);
                        }
                        that.triggerSync('update', offset, true);
                    }
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
            isRunning = false;

        function onTick() {
            var changes = [];
            if (doStop) {
                doStop = false;
                isRunning = false;
                return;
            }
            brute.call(that, buffer, changes);
            //lifeScan.call(that, livingList, birthingList, buffer, seed);
            that.triggerSync('tick', buffer);
            changes.forEach(function (change) {
                change();
            });

            //livingList = livingList.concat(birthingList).filter(function (el) {
            //    return el !== null;
            //});
            //birthingList = [];
            $timeout(onTick, that.config.tickInterval);
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
            // Initialize Buffers
            buffer = new Map2d(conf).walk(function zero(cell, x, y) {
                /*jshint validthis: true */
                if (cell) {
                    this.set(x, y, 1);
                } else {
                    this.set(x, y, 0);
                }

            });

            //livingList = Object.keys(that.config.seed).filter(function (el) {
            //    return +that.config.seed[el] === 1;
            //});
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
