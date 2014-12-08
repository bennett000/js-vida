/*global describe, it, spyOn, expect, window, angular, module */

describe('Renderer Service', function () {
    'use strict';

    beforeEach(function () {
        module('JSVida');
    });

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
});