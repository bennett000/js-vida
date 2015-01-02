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
describe('TypedList', function () {
    'use strict';

    beforeEach(function () {
        module('JSVida-List');
    });

    var validConfig = {factory: function (el) { return el; }};

    it('should be a constructor', inject(function (TypedList) {
        expect(TypedList(validConfig) instanceof TypedList).toBe(true);
        expect(new TypedList(validConfig) instanceof TypedList).toBe(true);
    }));

    it('should start with size zero', inject(function (TypedList) {
        var l = new TypedList(validConfig);
        expect(l.size()).toBe(0);
    }));

    it('throw without a factory', inject(function (TypedList) {
        expect(function () {
            var l = new TypedList();
        }).toThrow();
    }));

    it('pushing a valid el should increase size', inject(function (TypedList) {
        var l = new TypedList(validConfig);
        l.push(l.newEl({x: 5}));
        expect(l.size()).toBe(1);
    }));

    it('pushing nothing should do nothing', inject(function (TypedList) {
        var l = new TypedList(validConfig);
        l.push(l.newEl());
        expect(l.size()).toBe(0);
    }));

    it('walk should do nothing with no callback', inject(function (TypedList) {
        var l = new TypedList(validConfig);
        l.push(l.newEl({x: 5}));
        expect(l.walk()).toBe(l);
    }));

    it('walk should traverse the list', inject(function (TypedList) {
        var l = new TypedList(validConfig), count = 0;
        l.push(l.newEl({x: 5}));
        l.push(l.newEl({x: 6}));
        l.walk(function () { count += 1; })
        expect(count).toBe(2);
    }));

    it('walk should skip garbage', inject(function (TypedList) {
        var l = new TypedList(validConfig);
        l.push(l.newEl({x: 5}));
        l.push(l.newEl({x: 6}));
        l.push(l.newEl({x: 7}));
        l.delete(1);
        l.walk(function (el) { expect(el === 6).toBe(false); });
    }));

    it('walk should use the list\'s context', inject(function (TypedList) {
        var l = new TypedList(validConfig);
        l.push(l.newEl({x: 5}));
        l.walk(function () { expect(this).toBe(l); });
    }));


    it('delete should skip out of bounds',
       inject(function (TypedList) {
           var l = new TypedList(validConfig);
           l.push(l.newEl({x: 5}));
           expect(l.delete(10)).toBe(false);
       }));

    it('delete should _not_ immediately affect size',
       inject(function (TypedList) {
           var l = new TypedList(validConfig);
           l.push(l.newEl({x: 5}));
           expect(l.delete(0)).toBe(true);
           expect(l.size()).toBe(1);
       }));

    it('gc should purge garbage',
       inject(function (TypedList) {
           var l = new TypedList(validConfig);
           l.push(l.newEl({x: 5}));
           expect(l.delete(0)).toBe(true);
           expect(l.size()).toBe(1);
           l.gc();
           expect(l.size()).toBe(0);
       }));

    it('gc should keep values',
       inject(function (TypedList) {
           var l = new TypedList(validConfig);
           l.push(l.newEl({x: 5}));
           l.push(l.newEl({x: 7}));
           expect(l.delete(0)).toBe(true);
           expect(l.size()).toBe(2);
           l.gc();
           expect(l.size()).toBe(1);
       }));

    it('get should return recycled objects', inject(function (TypedList) {
        var l = new TypedList(validConfig),
        test1 = { x: 0, y: 1},
        test2 = { x: 5, y: 5},
        compare;
        l.push(test1);
        l.push(test2);
        l.delete(0);
        compare = l.newEl();
        expect(compare).toBe(test1);
        expect(compare).not.toBe(test2);
    }));
});
