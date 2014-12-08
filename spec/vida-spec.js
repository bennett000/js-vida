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
});