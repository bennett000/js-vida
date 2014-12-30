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


    it('setPixel should set specific pixel (0, 0)', inject(function (Bitmap) {
        var b = new Bitmap(validConfig);
        b.setPixel(0, 0, 100, 101, 102, 103);
        expect(b.map[0]).toBe(100);
        expect(b.map[1]).toBe(101);
        expect(b.map[2]).toBe(102);
        expect(b.map[3]).toBe(103);
    }));

    it('setPixelOffset should set specific pixel 0', inject(function (Bitmap) {
        var b = new Bitmap(validConfig);
        b.setPixelOffset(0, 100, 101, 102, 103);
        expect(b.map[0]).toBe(100);
        expect(b.map[1]).toBe(101);
        expect(b.map[2]).toBe(102);
        expect(b.map[3]).toBe(103);
    }));

    it('setPixelOffset should return undefined on invalid',
       inject(function (Bitmap) {
           var b = new Bitmap(validConfig);
           expect(b.setPixelOffset(50000, 100, 101, 102, 103)).toBeUndefined();
       }));

    it('setPixelOffset should return undefined on invalid',
       inject(function (Bitmap) {
           var b = new Bitmap(validConfig);
           expect(b.setPixelOffset(-10, 100, 101, 102, 103)).toBeUndefined();
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

    it('getPixelOffset should return the colour at 0', inject(function (Bitmap) {
        var b = new Bitmap(validConfig),
            c = b.getPixelOffset(0);
        expect(c.r).toBe(255);
        expect(c.g).toBe(255);
        expect(c.b).toBe(255);
        expect(c.a).toBe(255);
    }));

    it('getPixelOffset should return null if invalid > length',
       inject(function (Bitmap) {
           var b = new Bitmap(validConfig),
               c = b.getPixelOffset(5000);
           expect(c).toBe(null);
       }));

    it('getPixelOffset should return null if invalid < 0',
       inject(function (Bitmap) {
           var b = new Bitmap(validConfig),
               c = b.getPixelOffset(-5);
           expect(c).toBe(null);
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

    it('getOffset should return null when invalid', inject(function (Bitmap) {
        var b = new Bitmap(validConfig);
        expect(b.getOffset(5000)).toBe(null);
    }));
});
