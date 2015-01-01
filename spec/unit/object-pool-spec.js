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
describe('ObjectPool', function () {
    'use strict';

    beforeEach(function () {
        module('JSVida-ObjectPool');
    });

    it('should be a constructor', inject(function (ObjectPool) {
        expect(ObjectPool() instanceof ObjectPool).toBe(true);
        expect(new ObjectPool() instanceof ObjectPool).toBe(true);
    }));

    it('should start with size 0', inject(function (ObjectPool) {
        var o = new ObjectPool();
        expect(o.size()).toBe(0);
    }));

    it('initially, get should return the result of the given factory',
       inject(function (ObjectPool) {
           var o = new ObjectPool({factory: function (el) { return el; }});
           expect(o.get(57)).toBe(57);
       }));

    it('put should add an object to the pool', inject(function (ObjectPool) {
        var o = new ObjectPool({factory: function (el) { return el; }}),
            test = { x: 5, y: 43 };
        o.put(test);
        expect(o.size()).toBe(1);
    }));

    it('put should skip undefined', inject(function (ObjectPool) {
        var o = new ObjectPool({factory: function (el) { return el; }});
        o.put();
        expect(o.size()).toBe(0);
    }));

    it('put should trigger GC', inject(function (ObjectPool) {
        var o = new ObjectPool({factory: function (el) { return el; }, max: 3});
        o.put(35);
        o.put(36);
        o.put(37);
        o.put(38);
        expect(o.size()).toBe(0);
    }));

    it('put should skip emptying if < 1', inject(function (ObjectPool) {
        var o = new ObjectPool({factory: function (el) { return el; }, max: -1});
        o.put(35);
        expect(o.size()).toBe(1);
    }));

    it('if there are objects in the pool get should return those',
       inject(function (ObjectPool) {
           var o = new ObjectPool({factory: function (el) { return el; }}),
               test = { x: 5, y: 43 };
           o.put(test);
           expect(o.get()).toBe(test);
       }));

});
