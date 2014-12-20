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
describe('Animation Frame Service', function () {
    'use strict';

    beforeEach(function () {
        module('JSVida-3d-Render');
    });

    it('animationFrame should be window.requestAnimationFrame',
       inject(function (animationFrame) {
           expect(animationFrame).toBe(window.requestAnimationFrame);
       }));
});
describe('Renderer Service', function () {
    'use strict';

    beforeEach(function () {
        module('JSVida-3d-Render');
    });

    beforeEach(module(function ($provide) {
        $provide.value('animationFrame', mock3d.animationFrame);
    }));

    it('should provide a size function', inject(function (renderer) {
        expect(typeof renderer.size).toBe('function');
    }));

    it('should provide an x accessor', inject(function (renderer) {
        expect(typeof renderer.x).toBe('function');
    }));

    it('should provide a y accessor', inject(function (renderer) {
        expect(typeof renderer.y).toBe('function');
    }));

    it('x should set x if it is a number greater than zero',
       inject(function (renderer) {
           renderer.x(65);
           expect(renderer.x()).toBe(65);
       }));

    it('y should set y if it is a number greater than zero',
       inject(function (renderer) {
           renderer.y(65);
           expect(renderer.y()).toBe(65);
       }));

    it('size should set x/y if they are numbers greater than zero',
       inject(function (renderer) {
           renderer.size(1, 1);
           expect(renderer.x()).toBe(1);
           expect(renderer.y()).toBe(1);
       }));

    it('size should set x/y if they are numbers greater than zero, including' +
       'string casts',
       inject(function (renderer) {
           renderer.size('10', '11');
           expect(renderer.x()).toBe(10);
           expect(renderer.y()).toBe(11);
       }));

    it('size should return a has with width/height', inject(function (renderer) {
        expect(renderer.size()).toBeTruthy();
        expect(typeof renderer.size()).toBe('object');
        expect(typeof renderer.size().width).toBe('number');
        expect(typeof renderer.size().height).toBe('number');
    }));

    it('size should return a has with width/height on invalid inputs',
       inject(function (renderer) {
           expect(renderer.size()).toBeTruthy();
           expect(typeof renderer.size(-253)).toBe('object');
           expect(typeof renderer.size({}).width).toBe('number');
           expect(typeof renderer.size(-2352, 235).height).toBe('number');
       }));

    it('should have a stop function', inject(function (renderer) {
        expect(typeof renderer.stop).toBe('function');
    }));

    it('should have a start function', inject(function (renderer) {
        expect(typeof renderer.start).toBe('function');
    }));

    it('start should call animationFrame', inject(function (renderer) {
        expect(renderer.start(mock3d.scene, mock3d.camera)).toBe(true);
    }));

    it('start should *not* call animationFrame if stop has been called',
       inject(function (renderer) {
           renderer.stop();
           expect(renderer.start(mock3d.scene, mock3d.camera)).toBe(false);
       }));

    it('if a callback is provided to start, it should be called',
       inject(function (renderer) {
           var done = false;
           renderer.start(mock3d.scene, mock3d.camera, function () {
               done = true;
           });
           expect(done).toBe(true);
       }));
});

describe('Scene Service', function () {
    'use strict';

    beforeEach(function () {
        module('JSVida-3d-Render');
    });
});

describe('vidaCamera0', function () {
    'use strict';
    var el, scope

    beforeEach(function () {
        module('JSVida-3d-Render');
    });

    beforeEach(inject(function ($rootScope, $compile, scene, renderer) {
        spyOn(renderer, 'start');
        scene.cameras = mock3d.cameras;
        scope = $rootScope.$new();

        el = '<vida-camera-0></vida-camera-0>';

        el = $compile(el)(scope);
        scope.$digest();
    }));

    it('should start the renderer', inject(function (renderer) {
        expect(renderer.start).toHaveBeenCalled();
    }));
});
