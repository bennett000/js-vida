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
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(0, 0, 100, 0).x).toBe(9);
            expect(m.getNeighbour(0, 0, -100, 0).x).toBe(1);
        }));

        it('getNeighbour should clamp y vals', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10});
            expect(m.getNeighbour(0, 0, 0, 100).y).toBe(9);
            expect(m.getNeighbour(0, 0, 0, -100).y).toBe(1);
        }));

        // SPHERE MODE
        /** @todo test for odd sizes */
        it('getNeighbour sphere (0, 0), (0, -1)', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10, wrapMode: 'sphere'});
            expect(m.getNeighbour(0, 0, 0, -1).x).toBe(5);
            expect(m.getNeighbour(0, 0, 0, -1).y).toBe(0);
        }));

        it('getNeighbour sphere (5, 0), (-1, -1)', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10, wrapMode: 'sphere'});
            expect(m.getNeighbour(5, 0, -1, -1).x).toBe(9);
            expect(m.getNeighbour(5, 0, -1, -1).y).toBe(0);
        }));

        it('getNeighbour sphere (0, 0), (-1, -1)', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10, wrapMode: 'sphere'});
            expect(m.getNeighbour(0, 0, -1, -1).x).toBe(4);
            expect(m.getNeighbour(0, 0, -1, -1).y).toBe(0);
        }));

        it('getNeighbour sphere (9, 9), (0, 1)', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10, wrapMode: 'sphere'});
            expect(m.getNeighbour(9, 9, 0, 1).x).toBe(4);
            expect(m.getNeighbour(9, 9, 0, 1).y).toBe(9);
        }));

        it('getNeighbour sphere (5, 9), (1, 1)', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10, wrapMode: 'sphere'});
            expect(m.getNeighbour(5, 9, 1, 1).x).toBe(1);
            expect(m.getNeighbour(5, 9, 1, 1).y).toBe(9);
        }));

        it('getNeighbour sphere (9, 9), (1, 1)', inject(function (Map2d) {
            var m = new Map2d({x: 10, y: 10, wrapMode: 'sphere'});
            expect(m.getNeighbour(9, 9, 1, 1).x).toBe(5);
            expect(m.getNeighbour(9, 9, 1, 1).y).toBe(9);
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

    it('validateLoadData should should force an array of arrays',
       inject(function (Map2d) {
           var c = new Map2d();
           expect(Array.isArray(
           Map2d.prototype.validateLoadData.call({
                                                     config: {
                                                         x: 10,
                                                         y: 10,
                                                         seed: NaN
                                                     }
                                                 }))).toBe(true);

       }));

    it('validateLoadData should ignore over-sized y arrays',
       inject(function (Map2d) {
           var c = new Map2d({x: 1, y: 1, seed: [[5, 5, 5, 5, 5, 5]]});
           expect(c.validateLoadData()[0].length).toBe(0);
       }));

    it('validateLoadData should ignore over-sized x arrays',
       inject(function (Map2d) {
           var c = new Map2d({x: 1, y: 1, seed: [5, 5, 5, 5, 5, 5]});
           expect(c.validateLoadData().length).toBe(0);
       }));

    it('validateLoadData should force seed to type Array.<Array>',
       inject(function (Map2d) {
           var c = new Map2d({x: 10, y: 10, seed: [5, 5, 5, 5, 5, 5]});
           expect(Array.isArray(c.validateLoadData()[2])).toBe(true);
           expect(Array.isArray(c.validateLoadData()[0])).toBe(true);
       }));

    it('load should load a valid map', inject(function (Map2d) {
        var m = new Map2d({x: 2, y: 2});
        m.load([[5, 4], [7, 6]]);
        expect(m.map.length).toBe(2);
        expect(m.map[0].length).toBe(2);
        expect(m.map[1].length).toBe(2);
    }));

    it('load should load a valid map', inject(function (Map2d) {
        var m = new Map2d({x: 2, y: 2});
        m.load([[5, 4], [7, 6]]);
        expect(m.map.length).toBe(2);
        expect(m.map[0].length).toBe(2);
        expect(m.map[1].length).toBe(2);
    }));

    it('get should return the expected cell', inject(function (Map2d) {
        var m = new Map2d({x: 2, y: 2});
        m.load([[5, 4], [7, 6]]);
        expect(m.get(0, 1)).toBe(4);
    }));

    it('get should return undefined if x out of bounds',
       inject(function (Map2d) {
           var m = new Map2d({x: 2, y: 2});
           m.load([[5, 4], [7, 6]]);
           expect(m.get(10, 1)).toBe(undefined);
       }));

    it('get should return undefined if y out of bounds',
       inject(function (Map2d) {
           var m = new Map2d({x: 2, y: 2});
           m.load([[5, 4], [7, 6]]);
           expect(m.get(0, 10)).toBe(undefined);
       }));

    it('set should return the expected cell', inject(function (Map2d) {
        var m = new Map2d({x: 2, y: 2});
        m.load([[5, 4], [7, 6]]);
        expect(m.set(0, 1, 77)).toBe(true);
        expect(m.get(0, 1)).toBe(77);
    }));

    it('set should return false if x of bounds', inject(function (Map2d) {
        var m = new Map2d({x: 2, y: 2});
        m.load([[5, 4], [7, 6]]);
        expect(m.set(-10, 1)).toBe(false);
    }));

    it('set should return false if y of bounds', inject(function (Map2d) {
        var m = new Map2d({x: 2, y: 2});
        m.load([[5, 4], [7, 6]]);
        expect(m.set(0, -10)).toBe(false);
    }));

    it('cell should get if there is no third param', inject(function (Map2d) {
        var m = new Map2d({x: 2, y: 2, seed: [[5, 4],[7,6]]});
        expect(m.cell(0,0)).toBe(5);
    }));

    it('cell should set if there is a third param', inject(function (Map2d) {
        var m = new Map2d({x: 2, y: 2, seed: [[5, 4],[7,6]]});
        expect(m.cell(0,0, 80)).toBe(true);
        expect(m.cell(0, 0)).toBe(80);
    }));

    it('walk the array left/right top/bottom', inject(function (Map2d) {
        var m = new Map2d({x: 2, y: 2, seed: [[5, 4],[7,6]]}),
            count = 0;
        m.walk(function lambda(val) {
            switch (count) {
                case 0:
                    expect(val).toBe(5);
                    break;
                case 1:
                    expect(val).toBe(4);
                    break;
                case 2:
                    expect(val).toBe(7);
                    break;
                default:
                    expect(val).toBe(6);
                    break;
            }
            count += 1;
        });
        expect(count).toBe(4);
    }));

    it('walk uses the map\'s context', inject(function (Map2d) {
        var m = new Map2d({x: 2, y: 2, seed: [[5, 4],[7,6]]});
        m.walk(function lambda(val) {
            expect(this === m).toBe(true);
        });
    }));

    it('walk returns the map\'s context', inject(function (Map2d) {
        var m = new Map2d({x: 2, y: 2, seed: [[5, 4],[7,6]]});
        expect(m.walk(function lambda(val) {})).toBe(m);
    }));

    it('skip walk if no callback provided', inject(function (Map2d) {
        var m = new Map2d({x: 2, y: 2, seed: [[5, 4],[7,6]]});
        expect(m.walk()).toBeUndefined();
    }));

    it('clone returns a copy of the object', inject(function (Map2d) {
        var m = new Map2d({x: 2, y: 2, seed: [[5, 4],[7,6]]}),
            n = m.clone();

        expect(m === n).toBe(false);
        expect(n instanceof Map2d).toBe(true);
        expect(n.get(1,1)).toBe(6);
    }));
});
