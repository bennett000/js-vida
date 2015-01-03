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
    'JSVida-List'
]).factory('Conway', ['$timeout', 'makeListener', 'Map2d', 'LinkedList', function ($timeout, makeListener, Map2d, LinkedList) {
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
    defaultHeight = 128;

    /**
     * @param cell {Map2dCell}
     * @returns {number}
     */
    function liveNeighbours(cell) {
        /*jshint validthis:true */
        /** @type {number} */
        var count = 0;

        // top left
        if (cell.tl.data) {
            count += 1;
        }

        // top
        if (cell.t.data) {
            count += 1;
        }

        // top right
        if (cell.tr.data) {
            count += 1;
        }

        // mid left
        if (cell.l.data) {
            count += 1;
        }

        // mid right
        if (cell.r.data) {
            count += 1;
        }

        // bottom left
        if (cell.bl.data) {
            count += 1;
        }

        // bottom
        if (cell.b.data) {
            count += 1;
        }

        // bottom right
        if (cell.br.data) {
            count += 1;
        }

        return count;
    }

    /**
     * @param changes {Array.<function(...)>}
     */
    function brute(changes) {
        /*jshint validthis:true */
        var that = this, isAlive, offsetTemp = {x: 0, y: 0};
        this.map.walk(function (data, x, y, cell) {
            var change = that.processCell(cell);
            if (change === 1) {
                isAlive = true;
            } else {
                isAlive = false;
            }

            // change any of the changers
            if (data !== change) {
                changes.push(function () {
                    cell.data = change;
                });
                that.triggerSync('update', x, y, isAlive);
            }
        });
    }

    /**
     * @param cell {Map2dCell}
     * @returns {number}
     */
    function processCell(cell) {
        /*jshint validthis:true */
        /** @type {number} */
        var neighbours = this.liveNeighbours(cell);

        // alive cases
        if (cell.data === 1) {
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
     * @param changes {Array.<function>}
     * @param cell {Map2dCell}
     * @param deleteFn {function(...)}
     */
    function lifeScanMainCell(changes, cell, deleteFn) {
        /*jshint validthis:true */
        // process main cell, which must be alive, but it can die
        var x = +cell.x, y = +cell.y;
        if (!this.processCell(cell)) {
            // trigger
            this.triggerSync('update', x, y, false);
            changes.push(function deathOrigin() {
                cell.data = 0;
                deleteFn();
            });
        }
    }

    /**
     * @param changes {Array.<function(...)>}
     * @param cell {Map2dCell}
     * @param scanned {Object}
     */
    function lifeScanNeighbour(changes, cell, scanned) {
        /*jshint validthis:true*/
        var that = this,
            change = this.processCell(cell),
            key = cell.x + '.' + cell.y;

        if (scanned[key]) {
            return;
        }
        scanned[key] = 1;

        // register births
        if (change === 1) {
            that.triggerSync('update', cell.x, cell.y, true);
            changes.push(function lifeScanBirth() {
                cell.data = 1;
                that.livingList.push(cell);
            });
        }
    }

    /**
     * @param changes {Array.<function(...)>}
     * @param cell {Map2dCell}
     * @param scanned {Object}
     */
    function lifeScanNeighbours(changes, cell, scanned) {
        /*jshint validthis:true*/
        if (cell.tl.data === 0) {
            this.lifeScanNeighbour(changes, cell.tl, scanned);
        }

        if (cell.t.data === 0) {
            this.lifeScanNeighbour(changes, cell.t, scanned);
        }

        if (cell.tr.data === 0) {
            this.lifeScanNeighbour(changes, cell.tr, scanned);
        }

        if (cell.bl.data === 0) {
            this.lifeScanNeighbour(changes, cell.bl, scanned);
        }

        if (cell.b.data === 0) {
            this.lifeScanNeighbour(changes, cell.b, scanned);
        }

        if (cell.br.data === 0) {
            this.lifeScanNeighbour(changes, cell.br, scanned);
        }

        if (cell.l.data === 0) {
            this.lifeScanNeighbour(changes, cell.l, scanned);
        }

        if (cell.r.data === 0) {
            this.lifeScanNeighbour(changes, cell.r, scanned);
        }
    }

    /**
     * @param changes {Array.<function(...)>}
     */
    function lifeScan(changes) {
        /*jshint validthis:true */
        var that = this, scanned = {};

        this.livingList.walk(function lifeScanWalk(cell, deleteFn) {
            lifeScanMainCell.call(that, changes, cell, deleteFn);
            lifeScanNeighbours.call(that, changes, cell, scanned);
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
            that.map = new Map2d(that.config).walk(function zero(data, x, y, cell) {
                /*jshint validthis: true */
                if (data) {
                    that.livingList.push(cell);
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
    Conway.prototype.processCell = processCell;
    Conway.prototype.liveNeighbours = liveNeighbours;
    Conway.prototype.brute = brute;
    Conway.prototype.lifeScan = lifeScan;
    Conway.prototype.lifeScanNeighbour = lifeScanNeighbour;

    return Conway;
}]);
