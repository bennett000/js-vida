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
describe('Vida Menu Directive', function () {
    'use strict';
    var el, scope;

    beforeEach(function () {
        module('JSVida-Menus');
    });

    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();

        el = '<vida-menu></vida-menu>';

        el = $compile(el)(scope);
        scope.$digest();
    }));

    it('should do something...', function () {

    });
});

describe('Vida Organism Directive', function () {
    'use strict';
    var el, scope;

    beforeEach(function () {
        module('JSVida-Menus');
    });

    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();

        el = '<vida-organisms></vida-organisms>';

        el = $compile(el)(scope);
        scope.$digest();
    }));

    it('should do something...', function () {

    });
});
