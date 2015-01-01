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

    it('validateSeed should should force an array of arrays',
       inject(function (Conway) {
           var c = new Conway();
           expect(Array.isArray(
           Conway.prototype.validateSeed.call({
                                                  config: {
                                                      x: 10,
                                                      y: 10,
                                                      seed: NaN
                                                  }
                                              }))).toBe(true);

       }));

    it('validateSeed should ignore over-sized y arrays',
       inject(function (Conway) {
           var c = new Conway({x: 1, y: 1, seed: [[5, 5, 5, 5, 5, 5]]});
           expect(c.validateSeed()[0].length).toBe(0);
       }));

    it('validateSeed should ignore over-sized x arrays',
       inject(function (Conway) {
           var c = new Conway({x: 1, y: 1, seed: [5, 5, 5, 5, 5, 5]});
           expect(c.validateSeed().length).toBe(0);
       }));

    it('validateSeed should force seed to type Array.<Array>',
       inject(function (Conway) {
           var c = new Conway({x: 10, y: 10, seed: [5, 5, 5, 5, 5, 5]});
           expect(Array.isArray(c.validateSeed()[2])).toBe(true);
           expect(Array.isArray(c.validateSeed()[0])).toBe(true);
       }));

    it('validateSeed should force cells to be numbers',
       inject(function (Conway) {
           var c = new Conway({x: 10, y: 10, seed: [[false, null, {}]]});
           expect(c.validateSeed()[0][0]).toBe(0);
           expect(c.validateSeed()[0][1]).toBe(0);
           expect(c.validateSeed()[0][2]).toBe(0);
       }));

    it('validateSeed should force cells that are non-numeric to zero',
       inject(function (Conway) {
           var c = new Conway({x: 10, y: 10, seed: [[false, [], true]]});
           expect(c.validateSeed()[0][0]).toBe(0);
           expect(c.validateSeed()[0][1]).toBe(0);
           expect(c.validateSeed()[0][2]).toBe(0);
       }));

    it('validateSeed should force cells to be 0/1',
       inject(function (Conway) {
           var c = new Conway({x: 10, y: 10, seed: [[NaN, 1, 56]]});
           expect(c.validateSeed()[0][0]).toBe(0);
           expect(c.validateSeed()[0][1]).toBe(1);
           expect(c.validateSeed()[0][2]).toBe(1);
       }));

});
