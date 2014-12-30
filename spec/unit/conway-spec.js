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
    var validConfig = { x: 10, y: 10, tickInterval: 100 };
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

    it('validateSeed should should force an array', inject(function (Conway) {
        expect(Array.isArray(Conway.validateSeed(6, 1, 2))).toBe(true);
    }));

    it('validateSeed should should force an array within limits',
       inject(function (Conway) {
           var bad = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
           expect(Conway.validateSeed(bad, 1, 2).toString()).toBe([].toString());
       }));

    it('given an array, and x/y completeSeed should fill an Array' +
       ' replacing truthy values with 1, and falsey values with 0',
       inject(function (Conway) {
           expect(Conway.completeSeed([5, true, NaN], 2, 2).toString()).
           toBe([1, 1, 0, 0].toString());
       }));
});
