/**
 * file: bitmap
 * Created by michael on 27/12/14.
 *
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
/*global angular*/
angular.module('JSVida-Bitmap', [
    'JSVida-Map2D'
]).factory('Bitmap', ['xyToOffset', function (xyToOffset) {
    'use strict';
    /** @const */
    var RGB = 'RGB',
    /** @const */
    RGBA = 'RGBA',
    /** @const */
    defaultColour = {
        r: 255,
        g: 255,
        b: 255,
        a: 255
    };

    /**
     * @param config {{ x: {number}, y: {number}, format: 'RGB'|'RGBA', data: Array.<number>= }}
     * @throws if x/y are invalid
     * @returns {{ x: {number}, y: {number}, format: 'RGB'|'RGBA', data: Array.<number>= }}
     */
    function validate(config) {
        var offset;
        config.x = +config.x || null;
        config.y = +config.y || null;
        if (!Array.isArray(config.data)) {
            config.data = [];
        }
        offset = 3;
        if (config.format !== RGB) {
            config.format = RGBA;
            offset = 4;
        }
        if ((config.x === null) || (config.y === null)) {
            throw new Error('Bitmap: requires config argument with at least x/y');
        }
        return {
            data: config.data,
            offset: offset,
            x: config.x,
            y: config.y,
            format: config.format,
            fill: config.fill || defaultColour
        };
    }

    /**
     * @param colour {*}
     * @returns {number}
     */
    function validateColour(colour) {
        if (+colour < 0) {
            colour = 0;
        }
        if (+colour > 255) {
            colour = 255;
        }
        if (colour !== colour) {
            colour = 0;
        }
        return +colour;
    }

    /**
     * @param offset {number}
     * @returns {boolean}
     */
    function validateOffset(offset) {
        /*jshint validthis:true */
        return (+offset >= 0) && (+offset < this.map.length);
    }

    /**
     * @param offset {number}
     * @param r {number}
     * @param g {number}
     * @param b {number}
     * @param a {number}
     */
    function setPixelOffset(offset, r, g, b, a) {
        /*jshint validthis:true */
        if (!validateOffset.call(this, offset)) {
            return;
        }
        offset = +offset * this.config.offset;
        this.map[offset] = validateColour(r);
        this.map[offset + 1] = validateColour(g);
        this.map[offset + 2] = validateColour(b);
        if (this.config.format === RGBA) {
            this.map[offset + 3] = validateColour(a);
        }
    }

    /**
     * @param x {number}
     * @param y {number}
     * @param r {number}
     * @param g {number}
     * @param b {number}
     * @param a {number}
     */
    function setPixel(x, y, r, g, b, a) {
        /*jshint validthis:true */
        var offset = xyToOffset.call(this, x, y);

        setPixelOffset.call(this, offset, r, g, b, a);
    }

    /**
     * @param offset {number}
     * @returns {{ r: {number}, g: {number}, b: {number}, a: {number}= }}|null
     */
    function getPixelOffset(offset) {
        /*jshint validthis:true */
        if (!validateOffset.call(this, offset)) {
            return null;
        }
        offset = +offset;
        var that = this;

        if (this.config.format === RGBA) {
            return {
                r: that.map[offset],
                g: that.map[offset + 1],
                b: that.map[offset + 2],
                a: that.map[offset + 3]
            };
        }  else {
            return {
                r: that.map[offset],
                g: that.map[offset + 1],
                b: that.map[offset + 2]
            };
        }
    }

    /**
     * @param x {number}
     * @param y {number}
     * @returns {{ r: {number}, g: {number}, b: {number}}} |
     * {{ r: {number}, g: {number}, b: {number}, a: {number} }}
     */
    function getPixel(x, y) {
        /*jshint validthis:true */
        var offset = xyToOffset.call(this, x, y) * this.config.offset;
        return getPixelOffset.call(this, offset);
    }

    /**
     * @param offset {number}
     * @returns {number}
     */
    function getOffset(offset) {
        /*jshint validthis:true */
        if (!validateOffset.call(this, offset)) {
            return null;
        }
        offset = +offset;

        return this.map[offset];
    }

    /**
     * Get the r component of the pixel at x/y
     * @param x {number}
     * @param y {number}
     * @returns {number}
     */
    function getPixelR(x, y) {
        /*jshint validthis:true */
        var offset = xyToOffset.call(this, x, y) * this.config.offset;
        return this.getOffset.call(this, offset);
    }

    /**
     * Get the g component of the pixel at x/y
     * @param x {number}
     * @param y {number}
     * @returns {number}
     */
    function getPixelG(x, y) {
        /*jshint validthis:true */
        var offset = xyToOffset.call(this, x, y) * this.config.offset;
        return this.getOffset.call(this, offset + 1);
    }

    /**
     * Get the b component of the pixel at x/y
     * @param x {number}
     * @param y {number}
     * @returns {number}
     */
    function getPixelB(x, y) {
        /*jshint validthis:true */
        var offset = xyToOffset.call(this, x, y) * this.config.offset;
        return this.getOffset.call(this, offset + 2);
    }

    /**
     * Get the a component of the pixel at x/y
     * @param x {number}
     * @param y {number}
     * @returns {number}
     */
    function getPixelA(x, y) {
        /*jshint validthis:true */
        var offset = xyToOffset.call(this, x, y) * this.config.offset;
        return this.getOffset.call(this, offset + 3);
    }

    /**
     * fills the bitmap with the given colour, or this.config.fill
     * @param colour {{ r: {number}, g: {number}, b: {number}, a: {number}= }}
     */
    function fill(colour) {
        /*jshint validthis:true */
        if (!colour) { colour = this.config.fill; }
        var i;
        for (i = 0; i < this.map.length; i += this.config.offset) {
            this.map[i] = colour.r;
            this.map[i + 1] = colour.g;
            this.map[i + 2] = colour.b;
            if (this.config.format === RGBA) {
                this.map[i + 3] = colour.a;
            }
        }
    }

    Bitmap.prototype.setPixel = setPixel;
    Bitmap.prototype.getPixel = getPixel;
    Bitmap.prototype.getPixelR = getPixelR;
    Bitmap.prototype.getPixelG = getPixelG;
    Bitmap.prototype.getPixelB = getPixelB;
    Bitmap.prototype.getPixelA = getPixelA;
    Bitmap.prototype.setPixelOffset = setPixelOffset;
    Bitmap.prototype.getPixelOffset = getPixelOffset;
    Bitmap.prototype.getOffset = getOffset;
    Bitmap.prototype.get1d = xyToOffset;
    Bitmap.prototype.fill = fill;

    /**
     * @param config {{ x: number, y: number, format: 'RGB'|'RGBA', data: Array.<number> }}
     * @returns {Bitmap}
     * @constructor
     */
    function Bitmap(config) {
        if (!(this instanceof Bitmap)) {
            return new Bitmap(config);
        }

        this.config = validate(config);
        this.map = new Uint8Array(this.config.x * this.config.y * this.config.offset);
        this.fill();
    }

    return Bitmap;
}]);
