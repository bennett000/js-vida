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
        factory: function (el) { return {val: el}; },
        recycle: function (obj, el) {
            obj.val = el;
            return obj;
        }
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
            var l = new TypedList({factory: angular.noop});
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
           validConfig.garbageLimit = 1;
           var l = new TypedList(validConfig),
               d = l.push(5, 0);
           d();
           expect(l.size()).toBe(1);
           l.gc();
           expect(l.size()).toBe(0);
       }));

    it('gc should keep values',
       inject(function (TypedList) {
           validConfig.garbageLimit = 1;
           var l = new TypedList(validConfig),
               d = l.push(5, 0);
           l.push(7, 0);
           d();
           expect(l.size()).toBe(2);
           l.gc();
           expect(l.size()).toBe(1);
       }));
});

describe('LinkedList', function () {
    'use strict';

    beforeEach(function () {
        module('JSVida-List');
    });

    it('should be a constructor', inject(function (LinkedList) {
        expect(LinkedList() instanceof LinkedList).toBe(true);
        expect(new LinkedList() instanceof LinkedList).toBe(true);
    }));

    it('should start with a size zero', inject(function (LinkedList) {
        var l = new LinkedList(), count = 0;
        l.walk(function () { count += 1; });
        expect(count).toBe(0);
        expect(l.length).toBe(0);
    }));

    it('push should add an item to the list', inject(function (LinkedList) {
        var l = new LinkedList(), count = 0;
        l.push('something');
        l.walk(function () { count += 1; });
        expect(count).toBe(1);
        expect(l.length).toBe(1);
    }));

    it('unshift should add an item to the list', inject(function (LinkedList) {
        var l = new LinkedList(), count = 0;
        l.unshift('something');
        l.walk(function () { count += 1; });
        expect(count).toBe(1);
        expect(l.length).toBe(1);
    }));

    it('pop should remove an item from the list I', inject(function (LinkedList) {
        var l = new LinkedList(), count = 0;
        l.push('something');
        l.pop();
        l.walk(function () { count += 1; });
        expect(count).toBe(0);
        expect(l.length).toBe(0);
    }));

    it('pop should remove an item from the list II', inject(function (LinkedList) {
        var l = new LinkedList(), count = 0;
        l.push('something');
        l.push('something else');
        l.pop();
        l.walk(function () { count += 1; });
        expect(count).toBe(1);
        expect(l.length).toBe(1);
    }));

    it('pop should return null if list empty', inject(function (LinkedList) {
        var l = new LinkedList();
        expect(l.pop()).toBe(null);;
    }));

    it('pop should remove the last item from the list',
       inject(function (LinkedList) {
           var l = new LinkedList();
           l.push('something');
           l.push('something else');
           l.push('something else else');
           l.push('creativity');
           expect(l.length).toBe(4);
           expect(l.pop()).toBe('creativity');
       }));

    it('shift should remove an item from the list I',
       inject(function (LinkedList) {
           var l = new LinkedList(), count = 0;
           l.unshift('something');
           l.shift();
           l.walk(function () { count += 1; });
           expect(count).toBe(0);
           expect(l.length).toBe(0);
       }));

    it('shift should remove an item from the list II',
       inject(function (LinkedList) {
           var l = new LinkedList(), count = 0;
           l.unshift('something');
           l.unshift('something else');
           l.shift();
           l.walk(function () { count += 1; });
           expect(count).toBe(1);
           expect(l.length).toBe(1);
       }));

    it('shift should return null if list empty', inject(function (LinkedList) {
        var l = new LinkedList();
        expect(l.shift()).toBe(null);;
    }));

    it('shift should remove the first item from the list',
       inject(function (LinkedList) {
           var l = new LinkedList(), count = 0;
           l.unshift('something crazy');
           l.unshift('something II');
           l.unshift('something III');
           l.unshift('something IV');
           l.unshift('what new material');
           expect(l.shift()).toBe('what new material');
           l.walk(function () { count += 1; });
           expect(count).toBe(4);
           expect(l.length).toBe(4);
       }));

    it('list should maintain order', inject(function (LinkedList) {
        var src = ['a', 'b', 'c', 'd', 'e'], l = new LinkedList(), i = 0;
        src.forEach(angular.bind(l, l.push));
        expect(l.length).toBe(5);
        l.walk(function (el) {
            expect(src[i] === el).toBe(true);
            i += 1;
        });
    }));

    it('walk should be reversable', inject(function (LinkedList) {
        var src = ['a', 'b', 'c', 'd', 'e'], l = new LinkedList(), i = 4;
        src.forEach(angular.bind(l, l.push));
        l.walk(function (el) {
            expect(src[i] === el).toBe(true);
            i -= 1;
        }, 'reverse');
    }));

    it('walk should provide a delete function', inject(function (LinkedList) {
        var src = ['a', 'b', 'c', 'd', 'e'], l = new LinkedList();
        src.forEach(angular.bind(l, l.push));
        l.walk(function (el, del) {
            if (el === 'c') { del(); }
        });
        l.walk(function (el) {
            expect(el === 'c').toBe(false);
        });
    }));
});
