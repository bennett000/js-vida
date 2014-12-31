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
describe('Generic Map class', function () {
    'use strict';

    beforeEach(function () {
        module('JSVida-Map2D');
    });

    it('should have a map array', inject(function (Map2d) {
        var m = new Map2d();
        expect(Array.isArray(m.map)).toBe(true);
    }));

    it('should initialize the x-axis arrays I', inject(function (Map2d) {
        var m = new Map2d({x: 64, y: 64});
        expect(m.map.length).toBe(64);
    }));

    it('should initialize the x-axis arrays II', inject(function (Map2d) {
        var m = new Map2d({x: 64, y: 64});
        m.map.forEach(function (row) {
            expect(Array.isArray(row)).toBe(true);
            expect(row.length).toBe(64);
        });
    }));


    describe('getNeighbour tests', function () {
        it('getNeighbour (0, 0) left', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(0, 0, -1, 0).x).toBe(9);
            expect(m.getNeighbour(0, 0, -1, 0).y).toBe(0);
        }));

        it('getNeighbour (0, 0) right', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(0, 0, 1, 0).x).toBe(1);
            expect(m.getNeighbour(0, 0, 1, 0).y).toBe(0);
        }));

        it('getNeighbour (0, 0) top', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(0, 0, 0, 1).x).toBe(0);
            expect(m.getNeighbour(0, 0, 0, 1).y).toBe(1);
        }));

        it('getNeighbour (0, 0) bottom', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(0, 0, 0, -1).x).toBe(0);
            expect(m.getNeighbour(0, 0, 0, -1).y).toBe(9);
        }));

        it('getNeighbour (0, 0) top left', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(0, 0, -1, 1).x).toBe(9);
            expect(m.getNeighbour(0, 0, -1, 1).y).toBe(1);
        }));

        it('getNeighbour (0, 0) top right', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(0, 0, 1, 1).x).toBe(1);
            expect(m.getNeighbour(0, 0, 1, 1).y).toBe(1);
        }));

        it('getNeighbour (0, 0) bottom left', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(0, 0, -1, -1).x).toBe(9);
            expect(m.getNeighbour(0, 0, -1, -1).y).toBe(9);
        }));

        it('getNeighbour (0, 0) bottom right', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(0, 0, 1, -1).x).toBe(1);
            expect(m.getNeighbour(0, 0, 1, -1).y).toBe(9);
        }));


        // 5, 5's
        it('getNeighbour (5, 5); left', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(5, 5, -1, 0).x).toBe(4);
            expect(m.getNeighbour(5, 5, -1, 0).y).toBe(5);
        }));

        it('getNeighbour (5, 5); right', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(5, 5, 1, 0).x).toBe(6);
            expect(m.getNeighbour(5, 5, 1, 0).y).toBe(5);
        }));

        it('getNeighbour (5, 5); top', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(5, 5, 0, 1).x).toBe(5);
            expect(m.getNeighbour(5, 5, 0, 1).y).toBe(6);
        }));

        it('getNeighbour (5, 5); bottom', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(5, 5, 0, -1).x).toBe(5);
            expect(m.getNeighbour(5, 5, 0, -1).y).toBe(4);
        }));

        it('getNeighbour (5, 5); top left', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(5, 5, -1, 1).x).toBe(4);
            expect(m.getNeighbour(5, 5, -1, 1).y).toBe(6);
        }));

        it('getNeighbour (5, 5); top right', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(5, 5, 1, 1).x).toBe(6);
            expect(m.getNeighbour(5, 5, 1, 1).y).toBe(6);
        }));

        it('getNeighbour (5, 5); bottom left', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(5, 5, -1, -1).x).toBe(4);
            expect(m.getNeighbour(5, 5, -1, -1).y).toBe(4);
        }));

        it('getNeighbour (5, 5); bottom right', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(5, 5, 1, -1).x).toBe(6);
            expect(m.getNeighbour(5, 5, 1, -1).y).toBe(4);
        }));


        // 9, 9's
        it('getNeighbour (9, 9); left', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(9, 9, -1, 0).x).toBe(8);
            expect(m.getNeighbour(9, 9, -1, 0).y).toBe(9);
        }));

        it('getNeighbour (9, 9); right', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(9, 9, 1, 0).x).toBe(0);
            expect(m.getNeighbour(9, 9, 1, 0).y).toBe(9);
        }));

        it('getNeighbour (9, 9); top', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(9, 9, 0, 1).x).toBe(9);
            expect(m.getNeighbour(9, 9, 0, 1).y).toBe(0);
        }));

        it('getNeighbour (9, 9); bottom', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(9, 9, 0, -1).x).toBe(9);
            expect(m.getNeighbour(9, 9, 0, -1).y).toBe(8);
        }));

        it('getNeighbour (9, 9); top left', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(9, 9, -1, 1).x).toBe(8);
            expect(m.getNeighbour(9, 9, -1, 1).y).toBe(0);
        }));

        it('getNeighbour (9, 9); top right', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(9, 9, 1, 1).x).toBe(0);
            expect(m.getNeighbour(9, 9, 1, 1).y).toBe(0);
        }));

        it('getNeighbour (9, 9); bottom left', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(9, 9, -1, -1).x).toBe(8);
            expect(m.getNeighbour(9, 9, -1, -1).y).toBe(8);
        }));

        it('getNeighbour (9, 9); bottom right', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(9, 9, 1, -1).x).toBe(0);
            expect(m.getNeighbour(9, 9, 1, -1).y).toBe(8);
        }));

        it('getNeighbour should clamp x vals', inject(function (Map2d) {
            var m = new Map2d({ x: 10, y: 10});
            expect(m.getNeighbour(0, 0, 100, 0).x).toBe(9);
            expect(m.getNeighbour(0, 0, -100, 0).x).toBe(1);
        }));

        it('getNeighbour should clamp y vals', inject(function (Map2d) {
            var m = new Map2d({ x: 10, y: 10});
            expect(m.getNeighbour(0, 0, 0, 100).y).toBe(9);
            expect(m.getNeighbour(0, 0, 0, -100).y).toBe(1);
        }));

    });
});

describe('xyToOffset class method - depends on config.x/config.y', function () {
    'use strict';
    //
    //
    // Note, this function depends on this.config.x, and this.config.y to be
    // present
    //
    //
    var that = {
        config: {
            x: 10,
            y: 10
        }
    };

    beforeEach(function () {
        module('JSVida-Map2D');
    });

    it('get1d method should convert x/y to linear offset, (0,0)->0',
       inject(function (xyToOffset) {
           expect(xyToOffset.call(that, 0, 0)).toBe(0);
       }));

    it('get1d method should convert x/y to linear offset, (5, 0)->5',
       inject(function (xyToOffset) {
           expect(xyToOffset.call(that, 5, 0)).toBe(5);
       }));

    it('get1d method should convert x/y to linear offset, (0, 5)->50',
       inject(function (xyToOffset) {
           expect(xyToOffset.call(that, 0, 5)).toBe(50);
       }));

    it('get1d method should wrap x < 0',
       inject(function (xyToOffset) {
           expect(xyToOffset.call(that, -1, 5)).toBe(59);
       }));

    it('get1d method should wrap y < 0',
       inject(function (xyToOffset) {
           expect(xyToOffset.call(that, 5, -2)).toBe(85);
       }));

    it('get1d method should wrap beyond limits  x > this.config.x',
       inject(function (xyToOffset) {
           expect(xyToOffset.call(that, 11, 5)).toBe(51);
       }));

    it('get1d method should wrap beyond limits  y > this.config.y',
       inject(function (xyToOffset) {
           expect(xyToOffset.call(that, 5, 10)).toBe(5);
       }));

    it('get1d method should convert x/y to linear offset, (5, 5)->55',
       inject(function (xyToOffset) {
           expect(xyToOffset.call(that, 5, 5)).toBe(55);
       }));
});
