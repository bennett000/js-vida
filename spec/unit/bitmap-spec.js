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
/*global mock3d */
describe('Bitmap Class', function () {
    'use strict';
    var validConfig = {x: 10, y: 10};

    beforeEach(function () {
        module('JSVida-Bitmap');
    });

    it('should be a constructor', inject(function (Bitmap) {
        expect(typeof Bitmap).toBe('function');
        expect(Bitmap(validConfig) instanceof Bitmap).toBe(true);
        expect(new Bitmap(validConfig) instanceof Bitmap).toBe(true);
    }));

    it('should throw without a config width', inject(function (Bitmap) {
        expect(function () { var b = new Bitmap(); }).toThrow();
        expect(function () { var b = new Bitmap({y: 5}); }).toThrow();
    }));

    it('should throw without a config height', inject(function (Bitmap) {
        expect(function () { var b = new Bitmap(); }).toThrow();
        expect(function () { var b = new Bitmap({x: 5}); }).toThrow();
    }));

    it('should have a map property that\'s unit8 ', inject(function (Bitmap) {
        var b = new Bitmap(validConfig);
        expect(b.map instanceof Uint8Array).toBe(true);
    }));

    it('should default to RGBA format', inject(function (Bitmap) {
        var b = new Bitmap(validConfig);
        expect(b.map.length).toBe(validConfig.x * validConfig.y * 4);
    }));

    it('should support RGB format', inject(function (Bitmap) {
        var b = new Bitmap({x: 2, y: 2, format: 'RGB'});
        expect(b.map.length).toBe(12);
    }));

    it('should support RGBA format', inject(function (Bitmap) {
        var b = new Bitmap({x: 2, y: 2, format: 'RGBA'});
        expect(b.map.length).toBe(16);
    }));

    it('get1d method should convert x/y to linear offset, (0,0)->0',
       inject(function (Bitmap) {
           var b = new Bitmap(validConfig);
           expect(b.get1d(0, 0)).toBe(0);
       }));

    it('get1d method should convert x/y to linear offset, (5, 0)->5',
       inject(function (Bitmap) {
           var b = new Bitmap(validConfig);
           expect(b.get1d(5, 0)).toBe(5);
       }));

    it('get1d method should convert x/y to linear offset, (0, 5)->50',
       inject(function (Bitmap) {
           var b = new Bitmap(validConfig);
           expect(b.get1d(0, 5)).toBe(50);
       }));

    it('get1d method should wrap x < 0',
       inject(function (Bitmap) {
           var b = new Bitmap(validConfig);
           expect(b.get1d(-1, 5)).toBe(59);
       }));

    it('get1d method should wrap y < 0',
       inject(function (Bitmap) {
           var b = new Bitmap(validConfig);
           expect(b.get1d(5, -2)).toBe(85);
       }));

    it('get1d method should wrap beyond limits  x > this.config.x',
       inject(function (Bitmap) {
           var b = new Bitmap(validConfig);
           expect(b.get1d(11, 5)).toBe(51);
       }));

    it('get1d method should wrap beyond limits  y > this.config.y',
       inject(function (Bitmap) {
           var b = new Bitmap(validConfig);
           expect(b.get1d(5, 10)).toBe(5);
       }));

    it('get1d method should convert x/y to linear offset, (5, 5)->55',
       inject(function (Bitmap) {
           var b = new Bitmap(validConfig);
           expect(b.get1d(5, 5)).toBe(55);
       }));

    it('setPixel should set specific pixel (0, 0)', inject(function (Bitmap) {
        var b = new Bitmap(validConfig);
        b.setPixel(0, 0, 100, 101, 102, 103);
        expect(b.map[0]).toBe(100);
        expect(b.map[1]).toBe(101);
        expect(b.map[2]).toBe(102);
        expect(b.map[3]).toBe(103);
    }));

    it('setPixel should set specific pixel (1, 10)', inject(function (Bitmap) {
        var b = new Bitmap(validConfig);
        b.setPixel(1, 9, 100, 101, 102, 103);
        expect(b.map[364]).toBe(100);
        expect(b.map[365]).toBe(101);
        expect(b.map[366]).toBe(102);
        expect(b.map[367]).toBe(103);
    }));

    it('setPixel should clamp colours between 0/255', inject(function (Bitmap) {
        var b = new Bitmap(validConfig);
        b.setPixel(1, 9, -100, 301, NaN, 103);
        expect(b.getPixelR(1, 9)).toBe(0);
        expect(b.getPixelG(1, 9)).toBe(255);
        expect(b.getPixelB(1, 9)).toBe(0);
    }));

    it('getPixel should return the colour at (0, 0)', inject(function (Bitmap) {
        var b = new Bitmap(validConfig),
            c = b.getPixel(0, 0);
        expect(c.r).toBe(255);
        expect(c.g).toBe(255);
        expect(c.b).toBe(255);
        expect(c.a).toBe(255);
    }));

    it('getPixel should return the colour at (0, 0) (RGB)',
       inject(function (Bitmap) {
           var b = new Bitmap({x: 2, y: 2, format: 'RGB'}),
               c = b.getPixel(0, 0);
           expect(c.r).toBe(255);
           expect(c.g).toBe(255);
           expect(c.b).toBe(255);
           expect(c.a).toBeUndefined();
       }));

    it('getPixelR should return the red component off the colour at (0, 0)',
       inject(function (Bitmap) {
           var b = new Bitmap(validConfig);
           b.setPixel(0, 0, 5, 6, 7, 8);
           expect(b.getPixelR(0, 0)).toBe(5);
       }));

    it('getPixelG should return the red component off the colour at (0, 0)',
       inject(function (Bitmap) {
           var b = new Bitmap(validConfig);
           b.setPixel(0, 0, 5, 6, 7, 8);
           expect(b.getPixelG(0, 0)).toBe(6);
       }));

    it('getPixelB should return the red component off the colour at (0, 0)',
       inject(function (Bitmap) {
           var b = new Bitmap(validConfig);
           b.setPixel(0, 0, 5, 6, 7, 8);
           expect(b.getPixelB(0, 0)).toBe(7);
       }));

    it('getPixelA should return the red component off the colour at (0, 0)',
       inject(function (Bitmap) {
           var b = new Bitmap(validConfig);
           b.setPixel(0, 0, 5, 6, 7, 8);
           expect(b.getPixelA(0, 0)).toBe(8);
       }));
});
