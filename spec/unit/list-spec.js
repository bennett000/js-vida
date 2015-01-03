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

    var validConfig = {
        factory: function (el) { return { val: el }; },
        recycle: function (obj, el) { obj.val = el; return obj; }
    };

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

    it('throw without a recycle', inject(function (TypedList) {
        expect(function () {
            var l = new TypedList({ factory: angular.noop });
        }).toThrow();
    }));

    it('pushing a valid el should increase size', inject(function (TypedList) {
        var l = new TypedList(validConfig);
        l.push(5, 7);
        expect(l.size()).toBe(1);
    }));

    it('walk should do nothing with no callback', inject(function (TypedList) {
        var l = new TypedList(validConfig);
        l.push(5, 0);
        expect(l.walk()).toBe(l);
    }));

    it('walk should traverse the list', inject(function (TypedList) {
        var l = new TypedList(validConfig), count = 0;
        l.push(5, 6);
        l.push(6, 5);
        l.walk(function () { count += 1; })
        expect(count).toBe(2);
    }));

    it('walk should skip garbage', inject(function (TypedList) {
        var l = new TypedList(validConfig), kill;
        l.push(5);
        l.push(6);
        kill = l.push(7);
        kill();
        l.walk(function (el) { expect(el === 7).toBe(false); });
    }));

    it('walk should use the list\'s context', inject(function (TypedList) {
        var l = new TypedList(validConfig);
        l.push(5, 0);
        l.walk(function () { expect(this).toBe(l); });
    }));


    it('deletes should _not_ immediately affect size',
       inject(function (TypedList) {
           var l = new TypedList(validConfig),
               d = l.push(5, 0);
           d();
           expect(l.size()).toBe(1);
       }));

    it('gc should purge garbage',
       inject(function (TypedList) {
           var l = new TypedList(validConfig),
               d =  l.push(5, 0);
           d();
           expect(l.size()).toBe(1);
           l.gc();
           expect(l.size()).toBe(0);
       }));

    it('gc should keep values',
       inject(function (TypedList) {
           var l = new TypedList(validConfig),
               d =  l.push(5, 0);
           l.push(7, 0);
           d();
           expect(l.size()).toBe(2);
           l.gc();
           expect(l.size()).toBe(1);
       }));
});
