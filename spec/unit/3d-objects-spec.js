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
/*global THREE, Physijs*/
describe('Vida 3D Objects', function () {
    'use strict';

    beforeEach(function () {
        module('JSVida-3d-Objects');
    });

    describe('Simple Cube', function () {
        it('should be a function', inject(function (simpleCube) {
            expect(typeof simpleCube).toBe('function');
        }));

        it('should return a new three.Mesh object',
           inject(function (simpleCube) {
            expect(simpleCube() instanceof THREE.Mesh).toBe(true);
        }));
    });

    describe('Simple Sphere', function () {
        it('should be a function', inject(function (simpleSphere) {
            expect(typeof simpleSphere).toBe('function');
        }));

        it('should return a new three.Mesh object',
           inject(function (simpleSphere) {
               expect(simpleSphere() instanceof THREE.Mesh).toBe(true);
           }));
    });

    describe('Texture Sphere', function () {
        it('should be a function', inject(function (textureSphere) {
            expect(typeof textureSphere).toBe('function');
        }));

        it('should return a new three.Mesh object',
           inject(function (textureSphere) {
               expect(textureSphere() instanceof THREE.Mesh).toBe(true);
           }));
    });

    describe('Physics Cube', function () {
        it('should be a function', inject(function (physicsCube) {
            expect(typeof physicsCube).toBe('function');
        }));

        it('should return a new three.Mesh object',
           inject(function (physicsCube) {
               expect(physicsCube() instanceof Physijs.BoxMesh).toBe(true);
           }));

    });
});
