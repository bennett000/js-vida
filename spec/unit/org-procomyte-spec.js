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
describe('Procomyte', function () {
    'use strict';
    /**
     * @todo most of the procomyte code is not super likely to stay, so further
     * testing is not currently going to happen.  Procomytes are likely going to
     * inherit base functions from a yet to be devised parent class
     */
    beforeEach(function () {
        module('JSVida-Organism-Procomyte');
    });

    it('should be a function that creates a new procomyte ',
       inject(function (procomyte) {
        expect(typeof procomyte).toBe('function');
    }));

    it('should expose a species array', inject(function (procomyte) {
        expect(Array.isArray(procomyte.species)).toBe(true);
    }));

    it('should have a number returning population function',
       inject(function (procomyte) {
        expect(typeof procomyte.population()).toBe('number');
    }));

});