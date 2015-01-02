/**
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
/*global describe, it, spyOn, expect, window, angular, module, inject, beforeEach */
describe('Conway implementation', function () {
    'use strict';
    var validConfig = {x: 10, y: 10, tickInterval: 100};
    beforeEach(function () {
        module('JSVida-Conway');
    });

    it('should be a constructor', inject(function (Conway) {
        expect(typeof Conway).toBe('function');
        expect(Conway() instanceof Conway).toBe(true);
    }));

    it('should have a start function', inject(function (Conway) {
        expect(typeof Conway().start).toBe('function');
    }));

    it('should have a stop function', inject(function (Conway) {
        expect(typeof Conway().stop).toBe('function');
    }));


    it('constructor should apply defaults on invalid config',
       inject(function (Conway) {
           var c = new Conway({x: 10, y: 10, popMin: 57, popMax: 3});
           expect(c.config.popMin).toBe(2);
           expect(c.config.popMax).toBe(3);
       }));

    it('clamp function should force a minimum value', inject(function (Conway) {
        expect(Conway.clamp(-10, 0, 5)).toBe(0);
    }));

    it('clamp function should force a maximum value', inject(function (Conway) {
        expect(Conway.clamp(10, 0, 5)).toBe(5);
    }));

    it('clamp function should pass a valid value', inject(function (Conway) {
        expect(Conway.clamp(3, 0, 5)).toBe(3);
    }));

    it('clamp function should be inclusive', inject(function (Conway) {
        expect(Conway.clamp(5, 0, 5)).toBe(5);
        expect(Conway.clamp(0, 0, 5)).toBe(0);
    }));

    it('newPoint should return a simple new point', inject(function (Conway) {
        expect(Conway.newPoint(0, 0).x).toBe(0);
        expect(Conway.newPoint(0, 0).y).toBe(0);
    }));

    it('newPoint should return a new object', inject(function (Conway) {
        var p1 = Conway.newPoint(), p2 = Conway.newPoint();
        expect(p1).not.toBe(p2);
    }));

});

function getTestConway(testAlgo) {
    'use strict';

    function testConway() {
        var validConfig = {x: 5, y: 5, tickInterval: 100, popMin: 2, popMax: 3};

        // template
        validConfig.seed = [
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0]
        ];

        beforeEach(function () {
            delete validConfig.seed;
            module('JSVida-Conway');
        });

        function run(fn) {
            return fn();
        }

        it(testAlgo + ' should not directly make the changes',
           inject(function (Conway) {
               validConfig.seed = [
                   [0, 0, 0, 0, 0],
                   [0, 1, 1, 0, 0],
                   [0, 1, 0, 0, 0],
                   [0, 0, 0, 0, 0],
                   [0, 0, 0, 0, 0]
               ];

               var c = new Conway(validConfig),
                   changes = [];

               c[testAlgo](changes);
               // changes not made
               expect(c.map.get(2, 2)).toBe(0);
               changes.forEach(run);
               // changes made
               expect(changes.length).toBe(1);
           }));

        it(testAlgo + ' should make the expected changes - I',
           inject(function (Conway) {
               validConfig.seed = [
                   [0, 0, 0, 0, 0], // [0, 0, 0, 0, 0]
                   [0, 1, 1, 0, 0], // [0, 1, 1, 0, 0]
                   [0, 1, 0, 0, 0], // [0, 1, 1, 0, 0]
                   [0, 0, 0, 0, 0], // [0, 0, 0, 0, 0]
                   [0, 0, 0, 0, 0]  // [0, 0, 0, 0, 0]
               ];

               var c = new Conway(validConfig),
                   changes = [];

               c[testAlgo](changes);
               changes.forEach(run);
               expect(changes.length).toBe(1);
               expect(c.map.get(2, 2)).toBe(1);
           }));

        it(testAlgo + ' should make the expected changes - II',
           inject(function (Conway) {
               validConfig.seed = [
                   [0, 0, 0, 0, 0], // [0, 0, 1, 0, 0]
                   [0, 1, 1, 1, 0], // [0, 1, 0, 1, 0]
                   [0, 1, 1, 0, 0], // [0, 1, 0, 1, 0]
                   [0, 0, 0, 0, 0], // [0, 0, 0, 0, 0]
                   [0, 0, 0, 0, 0]  // [0, 0, 0, 0, 0]
               ];
               var c = new Conway(validConfig),
                   changes = [];

               c[testAlgo](changes);
               changes.forEach(run);
               expect(changes.length).toBe(4);
               expect(c.map.get(0, 2)).toBe(1);
               expect(c.map.get(1, 2)).toBe(0);
               expect(c.map.get(2, 2)).toBe(0);
               expect(c.map.get(2, 3)).toBe(1);
           }));
    }

    return testConway;
}


describe('Conway - Brute Force', getTestConway('brute'));

describe('Conway - Living List', getTestConway('lifeScan'));
