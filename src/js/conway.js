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
    'JSVida'
]).factory('Conway', ['$timeout', 'makeListener', function ($timeout, makeListener) {
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
    defaultHeight = 128;

    /**
     * @param seed {Array.<Number>}
     * @param x [number}
     * @param y {number}
     * @returns {Array}
     */
    function validateSeed(seed, x, y) {
        if (!Array.isArray(seed)) {
            seed = [];
        }
        x = +x || 0;
        y = +y || 0;

        if ((x * y) < seed.length) {
            seed = [];
        }
        return seed;
    }

    /**
     * @param seed {Array.<number>}
     * @param x {number}
     * @param y {number}
     * @returns {Array.<number>}
     */
    function completeSeed(seed, x, y) {
        x = +x || 0;
        y = +y || 0;
        seed = validateSeed(seed, x, y);
        var i;

        for (i = 0; i < (x * y); i += 1) {
            if (seed[i]) {
                seed[i] = 1;
            } else {
                seed[i] = 0;
            }
        }

        return seed;
    }

    /**
     *
     * @param offset
     * @param min
     * @param max
     * @returns {*}
     */
    function wrapOffset(offset, min, max) {
        if (offset < min) {
            offset = max + offset;
        }

        if (offset > max) {
            offset = offset - max;
        }

        return offset;
    }

    /**
     * @param offset {number}
     * @param relX {number}
     * @param relY {number}
     * @param limitX {number}
     * @param limitY {number}
     * @returns {number}
     */
    function getNeighbour(offset, relX, relY, limitX, limitY) {
        /** @type {number} */
        var neighbour, limit = limitX * limitY;

        // perform x operation
        neighbour = offset + relX;
        // perform y operation
        neighbour -= relY * (limitX - 1);

        return wrapOffset(neighbour, 0, limit);
    }


    /**
     * @param seed {Array.<Number>}
     * @param offset {number}
     * @param limitX {number}
     * @param limitY {number}
     * @returns {number}
     */
    function liveNeighbours(seed, offset, limitX, limitY) {
        /** @type {number} */
        var count = 0;

        // top left
        if (seed[getNeighbour(offset, -1, 1, limitX, limitY)]) {
            count += 1;
        }

        // top
        if (seed[getNeighbour(offset, 0, 1, limitX, limitY)]) {
            count += 1;
        }

        // top right
        if (seed[getNeighbour(offset, 1, 1, limitX, limitY)]) {
            count += 1;
        }

        // mid left
        if (seed[getNeighbour(offset, -1, 0, limitX, limitY)]) {
            count += 1;
        }

        // mid right
        if (seed[getNeighbour(offset, 1, 0, limitX, limitY)]) {
            count += 1;
        }

        // bottom left
        if (seed[getNeighbour(offset, -1, -1, limitX, limitY)]) {
            count += 1;
        }

        // bottom
        if (seed[getNeighbour(offset, 0, -1, limitX, limitY)]) {
            count += 1;
        }

        // bottom right
        if (seed[getNeighbour(offset, 1, -1, limitX, limitY)]) {
            count += 1;
        }

        return count;
    }

    /**
     * @param seed {Array.<number>}
     * @param result {Array.<number>}
     * @param x {number} limit
     * @param y {number} limit
     */
    function brute(seed, result, x, y) {
        /*jshint validthis:true */
        var change, that = this, isAlive;
        seed.forEach(function (cell, offset) {
            change = processCell.call(that, seed, result, offset, x, y);
            if (change === 1) {
                isAlive = true;
            } else {
                isAlive = false;
            }
            that.triggerSync('update', offset, isAlive);
        });

    }

    /**
     * @param seed {Array.<number>}
     * @param result {Array.<number>}
     * @param offset {number}
     * @returns {number}
     */
    function processCell(seed, result, offset) {
        /*jshint validthis:true */
        /** @type {number} */
        var neighbours = liveNeighbours(seed, offset, this.config.x,
                                        this.config.y),
        cell = seed[offset];
        // alive cases
        if (cell === 1) {
            // under pop case
            if (neighbours < this.config.popMin) {
                result[offset] = 0;
                return 0;
            }
            // even pop case
            if (neighbours <= this.config.popMax) {
                result[offset] = 1;
                return 1;
            }
            // over pop case
            result[offset] = 0;
            return 0;
        }
        // dead cases

        // birth case
        if (neighbours === 3) {
            result[offset] = 1;
            return 1;
        }
        // dead is dead case
        result[offset] = 0;
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
     * @param conf {{ x: number, y: number, seed: Array.<number>=, tickInterval: number=, popMin: number=, popMax: number= }}
     * @returns {Conway}
     * @constructor
     */
    function Conway(conf) {
        if (!(this instanceof Conway)) {
            return new Conway(conf);
        }

        this.config = validateConfig(conf);

        var that = makeListener(this),
            /** @type {Array.<number>} */
            buffer = [],
            /** @type {Array.<number>} */
            livingList = [],
            /** @type {Array.<number>} */
            birthingList = [],
            /** @type {boolean} */
            doStop = false,
            /** @type {boolean} */
            didFlip = false,
            /** @type {boolean} */
            isRunning = false;

        this.config.seed = completeSeed(this.config.seed, this.config.x,
                                        this.config.y);

        livingList = Object.keys(this.config.seed).filter(function (el) {
            return +that.config.seed[el] === 1;
        });

        function onTick() {
            if (doStop) {
                doStop = false;
                isRunning = false;
                didFlip = false;
                return;
            }
            if (didFlip) {
                brute.call(that, buffer, that.config.seed);
                //lifeScan.call(that, livingList, birthingList, buffer, seed);
                that.triggerSync('tick', that.config.seed);
                didFlip = false;
            } else {
                brute.call(that, that.config.seed, buffer);
                //lifeScan.call(that, livingList, birthingList, buffer, seed);
                that.triggerSync('tick', buffer);
                didFlip = true;
            }
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
            return that.config.seed;
        }

        function stop() {
            doStop = true;
        }

        this.start = start;
        this.stop = stop;
    }

    Conway.completeSeed = completeSeed;
    Conway.validateSeed = validateSeed;
    Conway.brute = brute;
    Conway.validateConfig = validateConfig;
    Conway.clamp = clamp;
    Conway.lifeScan = lifeScan;
    Conway.getNeighbour = getNeighbour;
    Conway.liveNeighbours = liveNeighbours;

    return Conway;
}]);
